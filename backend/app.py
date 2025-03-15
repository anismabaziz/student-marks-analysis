from flask import Flask, request, jsonify
from supabase_client import supabase
from flask_cors import CORS
import pandas as pd

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


@app.route("/students/stats", methods=["GET"])
def get_stats():
    column = request.args.get("column")
    if not column:
        return jsonify({"error": "Please provide a column name"}), 400

    all_records = []
    batch_size = 1000
    start = 0

    while True:
        response = (
            supabase.table("analysis_student_grades_usthb")
            .select("*")
            .range(start, start + batch_size - 1)
            .execute()
        )

        if response.data:
            all_records.extend(response.data)
            if len(response.data) < batch_size:
                break
            start += batch_size
        else:
            break

    data = pd.DataFrame(all_records)
    all_students = len(data)

    if column not in data.columns:
        return jsonify({"error": f"Column '{column}' not found"}), 400

    avg_grade = data[column].mean()
    max_grade = data[column].max()
    min_grade = data[column].min()
    passing_students = data.loc[data[column] >= 10, column].count()
    passing_rate = (passing_students / all_students) * 100

    return jsonify(
        {
            "column": column,
            "average_grade": round(avg_grade, 2),
            "max_grade": max_grade,
            "min_grade": min_grade,
            "passing_rate": round(passing_rate, 2),
        }
    )


@app.route("/students/mappings", methods=["GET"])
def get_mappings():
    response = (
        supabase.table("analysis_student_grades_usthb_mappings").select("*").execute()
    )

    return jsonify({"mappings": response.data})


@app.route("/students/top-performing", methods=["GET"])
def get_top_performing_students():
    column = request.args.get("column")
    if not column:
        return jsonify({"error": "Please provide a column name"}), 400

    response = (
        supabase.table("analysis_student_grades_usthb")
        .select("*")
        .order(column=column, desc=True)
        .limit(5)
        .execute()
    )
    return jsonify({"column": column, "data": response.data})


@app.route("/students/lowest-performing", methods=["GET"])
def get_lowest_perfoming_students():
    column = request.args.get("column")
    if not column:
        return jsonify({"error": "Please provide a column name"}), 400

    response = (
        supabase.table("analysis_student_grades_usthb")
        .select("*")
        .neq(column, 0)
        .order(column, desc=False)
        .limit(5)
        .execute()
    )
    return jsonify({"column": column, "data": response.data})


if __name__ == "__main__":
    app.run(debug=True, port=3000)
