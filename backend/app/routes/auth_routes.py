from flask import Blueprint, request, jsonify
from app.controllers.auth_controller import login

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login_route():
    data = request.get_json(silent=True)

    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "email et password requis"}), 400

    token, error = login(data["email"], data["password"])

    if error:
        return jsonify({"error": error}), 401

    return jsonify({"token": token}), 200
