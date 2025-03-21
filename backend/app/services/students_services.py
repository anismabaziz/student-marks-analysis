from ..supabase_client import supabase
from flask import request, jsonify


def find_students_data():
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


def find_students_mapping():
    table = request.args.get("table")
    if not table:
        return jsonify({"error": "Please provide a table name"}), 400
    response = supabase.table(table_name=table).select("*").execute()
    return jsonify({"mappings": response.data})


def find_analysis_tables():
    response = supabase.rpc("get_analysis_tables").execute()
    return jsonify({"tables": response.data})


def find_relevant_cols():
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
