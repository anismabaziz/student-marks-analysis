from flask import jsonify
from app.supabase_client import supabase


def find_mappings_by_table(table_id):
    # Query Supabase for mappings with the given table_id
    response = supabase.table("mappings").select("*").eq("table_id", table_id).execute()

    # If no mappings found, return 404
    if not response.data:
        return jsonify({"error": "Mappings not found"}), 404

    # Return the mappings as JSON
    return jsonify({"mappings": response.data}), 200


def find_relevant_mappings(table_id):
    # Query Supabase for mappings with the given table_id
    response = supabase.table("mappings").select("*").eq("table_id", table_id).execute()
    mappings = response.data

    # If no mappings found
    if not mappings:
        return jsonify({"error": "Mappings not found"}), 404

    # Filter out unwanted mappings
    unwanted_words = ["credit_ue", "moyenne_ue", "credits"]
    relevant_mappings = [
        mapping
        for mapping in mappings
        if not any(word in mapping["db_name"] for word in unwanted_words)
    ]

    return {"relevant_mappings": relevant_mappings}, 200
