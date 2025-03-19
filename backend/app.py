from flask import Flask, request, jsonify
from supabase_client import supabase
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)

CORS(app)


@app.route("/students", methods=["GET"])
def get_students():
    query = request.args.get("query")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    table = request.args.get("table")

    if not table:
        return jsonify({"error": "Please provide a table name"}), 400

    start = (page - 1) * limit
    end = start + limit - 1

    query_builder = supabase.table(table).select("*", count="exact")

    if query:
        query_builder = query_builder.ilike("name", f"%{query}%")

    students_response = query_builder.range(start, end).execute()
    mappings_response = supabase.table(f"{table}_mappings").select("*").execute()

    return jsonify(
        {
            "records": students_response.data,
            "page": page,
            "limit": limit,
            "total_records": students_response.count,
            "mappings": mappings_response.data,
        }
    )


@app.route("/students/stats", methods=["GET"])
def get_stats():
    module = request.args.get("module")
    table = request.args.get("table")
    if not module:
        return jsonify({"error": "Please provide a module name"}), 400

    if not table:
        return jsonify({"error": "Please provide a module name"}), 400

    all_records = []
    batch_size = 1000
    start = 0

    while True:
        response = (
            supabase.table(table_name=table)
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

    if module not in data.columns:
        return jsonify({"error": f"Column '{module}' not found"}), 400

    avg_grade = data[module].mean()
    max_grade = data[module].max()
    min_grade = data[module].min()
    passing_students = data.loc[data[module] >= 10, module].count()
    passing_rate = (passing_students / all_students) * 100

    return jsonify(
        {
            "module": module,
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
    module = request.args.get("module")
    table_name = request.args.get("table")
    if not module:
        return jsonify({"error": "Please provide a column name"}), 400
    if not table_name:
        return jsonify({"error": "Please provide a table name"}), 400

    response = (
        supabase.table(table_name=table_name)
        .select("*")
        .order(column=module, desc=True)
        .limit(5)
        .execute()
    )
    return jsonify({"module": module, "students": response.data})


@app.route("/students/lowest-performing", methods=["GET"])
def get_lowest_perfoming_students():
    module = request.args.get("module")
    table = request.args.get("table")
    if not module:
        return jsonify({"error": "Please provide a column name"}), 400
    if not table:
        return jsonify({"error": "Please provide a table name"}), 400
    response = (
        supabase.table(table)
        .select("*")
        .neq(module, 0)
        .order(module, desc=False)
        .limit(5)
        .execute()
    )
    return jsonify({"module": module, "students": response.data})


@app.route("/students/grades-distribution", methods=["GET"])
def get_grades_distribution():
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
    moyennes_semestre = data["moyenne_semestre"].values
    bin_edges = np.arange(0, 18, 2)
    i = 0
    bins = []
    for i in range(len(bin_edges) - 1):
        bins.append([int(bin_edges[i]), int(bin_edges[i + 1])])

    counts, _ = np.histogram(moyennes_semestre, bins=bin_edges)

    return jsonify({"bins": bins, "counts": counts.tolist()})


@app.route("/students/modules-averages", methods=["GET"])
def get_modules_averages():
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
    print(data.select_dtypes("float64", "int64").mean())
    return jsonify({"test": "test"})


@app.route("/students/tables", methods=["GET"])
def get_analysis_tables():
    response = supabase.rpc("get_analysis_tables").execute()
    return jsonify({"tables": response.data})


@app.route("/students/relevant-cols", methods=["GET"])
def get_relevant_cols():
    table = request.args.get("table")
    if not table:
        return jsonify({"error": "Please provide a table name"}), 400
    response = supabase.table(f"{table}_mappings").select("*").execute()
    cols = response.data
    unwanted_words = ["credit_ue", "moyenne_ue", "credits"]
    relevant_cols = [
        col
        for col in cols
        if not any(word in col["db_name"] for word in unwanted_words)
    ]
    return {"mappings": relevant_cols}


if __name__ == "__main__":
    app.run(debug=True, port=3000)
