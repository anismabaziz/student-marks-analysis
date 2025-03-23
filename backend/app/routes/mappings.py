from flask import Blueprint, jsonify, request
from app.services.mappings_service import find_mappings_by_table

mappings_bp = Blueprint("mappings", __name__)


@mappings_bp.route("/mappings", methods=["GET"])
def get_mappings():
    table_id = request.args.get("table_id")
    if not table_id:
        return jsonify({"error": "Table id must be included"}), 400
    return find_mappings_by_table(table_id)
