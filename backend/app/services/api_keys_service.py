from app.models.api_keys import APIKey
from flask import jsonify
from app.extensions import db


def find_api_keys():
    keys = APIKey.query.all()
    return jsonify({"keys": [key.to_dict() for key in keys]}), 200


def add_api_key(name):
    api_key = APIKey(name=name)
    db.session.add(api_key)
    db.session.commit()
    return jsonify({"key": api_key.to_dict()}), 201


def update_key_invalid(key_id):
    api_key = APIKey.query.get_or_404(key_id)
    api_key.is_active = False
    db.session.commit()
    return jsonify({"message": "API key invalidated."})


def remove_api_key(key_id):
    api_key = APIKey.query.get_or_404(key_id)
    db.session.delete(api_key)
    db.session.commit()
    return jsonify({"message": "API key deleted."}), 200
