from flask import Blueprint, request, jsonify, send_from_directory, current_app
from app.controllers import demande_controller
from app.middlewares.auth_required import auth_required
from app.middlewares.rate_limiter import limiter
from app.models import demande

demande_bp = Blueprint("demande", __name__)


@demande_bp.route("", methods=["POST"])
@limiter.limit("5 per hour")
def creer():
    fichier = request.files.get("fichier")
    resultat, error = demande_controller.creer_demande(request.form, fichier)

    if error:
        return jsonify({"error": error}), 400

    return jsonify(resultat), 201


@demande_bp.route("", methods=["GET"])
@auth_required
def lister():
    return jsonify(demande_controller.lister_demandes()), 200


@demande_bp.route("/<int:demande_id>", methods=["GET"])
@auth_required
def detail(demande_id):
    result = demande_controller.obtenir_detail(demande_id)
    if result is None:
        return jsonify({"error": "Demande introuvable"}), 404
    return jsonify(result), 200


@demande_bp.route("/<int:demande_id>/decision", methods=["PATCH"])
@auth_required
def decision(demande_id):
    data = request.get_json(silent=True)
    if not data or "decision" not in data:
        return jsonify({"error": "Champ 'decision' requis"}), 400

    result, error = demande_controller.traiter_demande(
        demande_id, data["decision"], data.get("commentaire")
    )

    if error:
        return jsonify({"error": error}), 400

    return jsonify(result), 200


@demande_bp.route("/<int:demande_id>/fichier", methods=["GET"])
@auth_required
def telecharger_fichier(demande_id):
    row = demande.find_by_id(demande_id)
    if row is None:
        return jsonify({"error": "Demande introuvable"}), 404

    return send_from_directory(
        current_app.config["UPLOAD_FOLDER"], row["fichier_path"], as_attachment=True
    )
