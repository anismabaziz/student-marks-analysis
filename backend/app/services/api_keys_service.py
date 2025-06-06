from flask import jsonify
from app.supabase_client import supabase
import uuid


def find_api_keys():
    response = supabase.table("analysis_api_keys").select("*").execute()

    if response.data is None:
        return jsonify({"error": "API keys not found"}), 404

    keys = response.data

    return jsonify({"keys": keys}), 200


def add_api_key(name):
    # Generate a new API key (example: using uuid)
    generated_key = str(uuid.uuid4())

    # Insert into the table
    response = (
        supabase.table("analysis_api_keys")
        .insert({"name": name, "key": generated_key})
        .execute()
    )

    # response.data is a list of inserted rows
    inserted_key = response.data[0] if response.data else None

    return jsonify({"key": inserted_key}), 201


def update_key_invalid(key_id):
    # Check if the key exists
    get_response = (
        supabase.table("analysis_api_keys").select("*").eq("id", key_id).execute()
    )

    if get_response.data is None:
        return jsonify({"error": "API key not found"}), 404

    # Update the is_active field
    supabase.table("analysis_api_keys").update({"is_active": False}).eq(
        "id", key_id
    ).execute()

    return jsonify({"message": "API key invalidated."}), 200


def remove_api_key(key_id):
    # Check if the API key exists
    get_response = (
        supabase.table("analysis_api_keys").select("*").eq("id", key_id).execute()
    )

    if get_response.data is None:
        return jsonify({"error": "API key not found"}), 404

    # Delete the API key
    supabase.table("analysis_api_keys").delete().eq("id", key_id).execute()

    return jsonify({"message": "API key deleted."}), 200
