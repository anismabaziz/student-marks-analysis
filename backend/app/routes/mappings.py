from flask import Blueprint, jsonify, request
from app.services.mappings_service import find_mappings_by_table, find_relevant_mappings
from flasgger import swag_from

mappings_bp = Blueprint("mappings", __name__)


@mappings_bp.route("/mappings", methods=["GET"])
@swag_from("/app/swagger/mappings/get_mappings.yaml")
def get_mappings():
    table_id = request.args.get("table_id")
    if not table_id:
        return jsonify({"error": "Table id must be included"}), 400
    return find_mappings_by_table(table_id)


@mappings_bp.route("/mappings/relevant", methods=["GET"])
def get_relevant_mappings():
    table_id = request.args.get("table_id")

    if not table_id:
        return jsonify({"error": "Please provide a table id"}), 400
    return find_relevant_mappings(table_id)
