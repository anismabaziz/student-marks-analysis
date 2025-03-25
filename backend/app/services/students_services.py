from flask import jsonify
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
            "students": students,
            "page": page,
            "limit": limit,
            "total_students": students_count,
            "mappings": mappings,
        }
    )
