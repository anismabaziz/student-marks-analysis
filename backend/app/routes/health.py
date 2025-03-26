from flask import Blueprint, jsonify
from flasgger import swag_from

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
@swag_from("/app/swagger/health/get_health.yaml")
def check_health():
    return jsonify({"status": "OK"}), 200
