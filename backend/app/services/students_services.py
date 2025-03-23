from ..supabase_client import supabase
from flask import request, jsonify
from app.extensions import metadata, db
from app.models.mappings import Mapping
from app.models.tables import TableName


def find_students(table_id, query, page, limit):
    table = TableName.query.get(table_id)
    if not table:
        return jsonify({"error": "Table not found"}), 404

    table_model = metadata.tables[table.db_name]
    query_builder = db.session.query(table_model)

    if query:
        query_builder = query_builder.filter(table_model.c.name.ilike(f"%{query}%"))

    start = (page - 1) * limit
    students_response = query_builder.offset(start).limit(limit).all()
    students = [dict(row._mapping) for row in students_response]

    students_count = db.session.query(table_model).count()
    mappings_response = Mapping.query.filter(Mapping.table_id == table.id).all()
    mappings = [mapping.to_dict() for mapping in mappings_response]

    return jsonify(
        {
            "records": students,
            "page": page,
            "limit": limit,
            "total_records": students_count,
            "mappings": mappings,
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
