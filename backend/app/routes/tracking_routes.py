from flask import Blueprint, jsonify, Response
from app.controllers import tracking_controller

tracking_bp = Blueprint("tracking", __name__)

@tracking_bp.route("/<string:token>", methods=["GET"])
def suivi(token):
    result = tracking_controller.obtenir_par_token(token)
    if result is None:
        return jsonify({"error": "Token invalide ou demande introuvable"}), 404
    return jsonify(result), 200

@tracking_bp.route("/<string:token>/ics", methods=["GET"])
def telecharger_ics(token):
    contenu, erreur = tracking_controller.obtenir_ics_par_token(token)
    if erreur:
        message, code = erreur
        return jsonify({"error": message}), code

    return Response(
        contenu,
        mimetype="text/calendar",
        headers={"Content-Disposition": "attachment; filename=rendez-vous.ics"},
    )
