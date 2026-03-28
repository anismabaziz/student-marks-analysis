from flask import Blueprint, jsonify
import psycopg2
import requests

from app.config.settings import Config


health_bp = Blueprint("health", __name__)


def check_supabase_connection():
    try:
        if not Config.SUPABASE_URL or not Config.SUPABASE_SECRET_KEY:
            return False, "Missing SUPABASE_URL or SUPABASE_SECRET_KEY"

        response = requests.get(
            f"{Config.SUPABASE_URL}/rest/v1/",
            headers={
                "apikey": Config.SUPABASE_SECRET_KEY,
                "Authorization": f"Bearer {Config.SUPABASE_SECRET_KEY}",
            },
            timeout=5,
        )

        if response.status_code >= 400:
            return False, f"Supabase API returned {response.status_code}"

        return True, "OK"
    except Exception as exc:
        return False, str(exc)


def check_postgres_connection():
    try:
        conn = psycopg2.connect(
            dbname=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            sslmode="require",
            connect_timeout=5,
        )
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")
        cursor.fetchone()
        cursor.close()
        conn.close()
        return True, "OK"
    except Exception as exc:
        return False, str(exc)


@health_bp.route("/health", methods=["GET"])
def check_health():
    supabase_ok, supabase_message = check_supabase_connection()
    postgres_ok, postgres_message = check_postgres_connection()

    all_ok = supabase_ok and postgres_ok
    status_code = 200 if all_ok else 503

    return (
        jsonify(
            {
                "status": "OK" if all_ok else "DEGRADED",
                "checks": {
                    "supabase_api": {
                        "ok": supabase_ok,
                        "message": supabase_message,
                    },
                    "postgres": {
                        "ok": postgres_ok,
                        "message": postgres_message,
                    },
                },
            }
        ),
        status_code,
    )
