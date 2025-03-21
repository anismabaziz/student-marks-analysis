from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def check_health():
    return jsonify({"response": "OK"}), 200
