from app.models.tables import TableName
from app.extensions import db
from flask import jsonify


def find_tables():
    tables = TableName.query.all()
    return jsonify(
        {
            "tables": [
                {
                    "id": table.id,
                    "db_name": table.db_name,
                    "name": table.name,
                    "valid": table.valid,
                }
                for table in tables
            ]
        }
    ), 200


def set_table_valid(table_id):
    table = TableName.query.get(table_id)
    if table is None:
        return jsonify({"error": "Table not found"}), 404

    table.valid = True
    db.session.commit()

    return jsonify({"message": "Table set valid successfully"}), 200


def set_table_invalid(table_id):
    table = TableName.query.get(table_id)
    if table is None:
        return jsonify({"error": "Table not found"}), 404

    table.valid = False
    db.session.commit()

    return jsonify({"message": "Table set invalid successfully"}), 200


def find_valid_tables():
    is_valid = True
    tables = TableName.query.filter(TableName.valid == is_valid).all()
    return jsonify(
        {
            "tables": [
                {
                    "id": table.id,
                    "db_name": table.db_name,
                    "name": table.name,
                    "valid": table.valid,
                }
                for table in tables
            ]
        }
    )
