from flask import Blueprint, jsonify
from app.controllers import tracking_controller

tracking_bp = Blueprint("tracking", __name__)

@tracking_bp.route("/<string:token>", methods=["GET"])
def suivi(token):
    result = tracking_controller.obtenir_par_token(token)
    if result is None:
        return jsonify({"error": "Token invalide ou demande introuvable"}), 404
    return jsonify(result), 200
