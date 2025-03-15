from flask import Flask, request, jsonify
from supabase_client import supabase

app = Flask(__name__)


@app.route("/students", methods=["GET"])
def get_students():
    query = request.args.get("query")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))

    start = (page - 1) * limit
    end = start + limit - 1

    query_builder = supabase.table("analysis_student_grades_usthb").select(
        "*", count="exact"
    )

    if query:
        query_builder = query_builder.ilike("name", f"%{query}%")

    response = query_builder.range(start, end).execute()

    return jsonify(
        {
            "data": response.data,
            "page": page,
            "limit": limit,
            "total_records": response.count,
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=3000)
