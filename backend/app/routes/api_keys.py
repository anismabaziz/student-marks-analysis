from flask import Blueprint, request, jsonify
from app.services.api_keys_service import (
    find_api_keys,
    add_api_key,
    update_key_invalid,
    remove_api_key,
)


keys_bp = Blueprint("api_keys", __name__)


@keys_bp.route("/keys", methods=["GET"])
def get_api_keys():
    return find_api_keys()


@keys_bp.route("/keys/create", methods=["POST"])
def create_api_key():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"error": "Missing 'name' in request body"}), 400
    return add_api_key(name)


@keys_bp.route("/keys/invalidate/<uuid:key_id>", methods=["PUT"])
def invalidate_api_key(key_id):
    return update_key_invalid(key_id)


@keys_bp.route("/keys/delete/<uuid:key_id>", methods=["DELETE"])
def delete_api_key(key_id):
    return remove_api_key(key_id)
