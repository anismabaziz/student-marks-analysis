from flask import jsonify
from app.supabase_client import supabase


def find_tables():
    # Query Supabase for all rows in the "tables" table
    response = supabase.table("tables").select("*").execute()

    tables = response.data

    return jsonify({"tables": tables}), 200


def set_table_valid(table_id):
    response = (
        supabase.table("tables").select("*").eq("id", table_id).single().execute()
    )

    if response.data is None:
        return jsonify({"error": "Table not found"}), 404

    supabase.table("tables").update({"valid": True}).eq("id", table_id).execute()

    return jsonify({"message": "Table set valid successfully"}), 200


def set_table_invalid(table_id):
    response = (
        supabase.table("tables").select("*").eq("id", table_id).single().execute()
    )

    if response.data is None:
        return jsonify({"error": "Table not found"}), 404

    supabase.table("tables").update({"valid": False}).eq("id", table_id).execute()

    return jsonify({"message": "Table set invalid successfully"}), 200


def find_valid_tables():
    response = supabase.table("tables").select("*").eq("valid", True).execute()

    if response.data is None:
        return jsonify({"error": "Tables not found"}), 404

    tables = response.data

    return jsonify({"tables": tables}), 200
