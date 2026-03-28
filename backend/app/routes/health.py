from flask import Blueprint, jsonify
import psycopg2
import requests
from google import genai

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


def check_google_ai_connection():
    try:
        if not Config.GOOGLE_API_KEY:
            return False, "Missing GOOGLE_API_KEY"

        client = genai.Client(api_key=Config.GOOGLE_API_KEY)
        response = client.models.generate_content(
            model=Config.GEMINI_MODEL,
            contents=["healthcheck"],
            config=genai.types.GenerateContentConfig(max_output_tokens=4),
        )

        if not response.text:
            return True, "Google AI reachable (empty text response)"

        return True, "OK"
    except Exception as exc:
        return False, str(exc)


@health_bp.route("/health", methods=["GET"])
def check_health():
    supabase_ok, supabase_message = check_supabase_connection()
    postgres_ok, postgres_message = check_postgres_connection()
    google_ai_ok, google_ai_message = check_google_ai_connection()

    all_ok = supabase_ok and postgres_ok and google_ai_ok
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
                    "google_ai": {
                        "ok": google_ai_ok,
                        "message": google_ai_message,
                    },
                },
            }
        ),
        status_code,
    )
