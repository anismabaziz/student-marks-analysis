from flask import jsonify
from app.models.mappings import Mapping


def find_mappings_by_table(table_id):
    mappings = Mapping.query.filter(Mapping.table_id == table_id)
    if not mappings:
        return jsonify({"error": "Mappings not found"}), 404

    return jsonify({"mappings": [mapping.to_dict() for mapping in mappings]}), 200


def find_relevant_mappings(table_id):
    mappings_response = Mapping.query.filter(Mapping.table_id == table_id)
    mappings = [mapping.to_dict() for mapping in mappings_response]

    if not mappings:
        return jsonify({"error": "Mappings not found"}), 404

    unwanted_words = ["credit_ue", "moyenne_ue", "credits"]
    relevant_mappings = [
        mapping
        for mapping in mappings
        if not any(word in mapping["db_name"] for word in unwanted_words)
    ]
    return {"relevant_mappings": relevant_mappings}, 200
