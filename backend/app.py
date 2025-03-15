from flask import Flask, request, jsonify
from supabase_client import supabase
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


@app.route("/students", methods=["GET"])
def get_students():
    query = request.args.get("query")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    start = (page - 1) * limit
    end = start + limit - 1

    query_builder = supabase.table("analysis_student_grades_usthb").select(
        "*", count="exact"
    )

    if query:
        query_builder = query_builder.ilike("name", f"%{query}%")

    students_response = query_builder.range(start, end).execute()
    mappings_response = (
        supabase.table("analysis_student_grades_usthb_mappings").select("*").execute()
    )

    return jsonify(
        {
            "data": students_response.data,
            "page": page,
            "limit": limit,
            "total_records": students_response.count,
            "mappings": mappings_response.data,
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=3000)
