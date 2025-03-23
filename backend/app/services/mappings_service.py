from flask import jsonify
from app.models.mappings import Mapping


def find_mappings_by_table(table_id):
    mappings = Mapping.query.filter(Mapping.table_id == table_id)
    if not mappings:
        return jsonify({"error": "Mappings not found"}), 404

    return jsonify({"mappings": [mapping.to_dict() for mapping in mappings]}), 200
