from flask import Blueprint, request, jsonify
from app.controllers import creneau_controller
from app.middlewares.auth_required import auth_required

creneau_bp = Blueprint("creneau", __name__)

@creneau_bp.route("/disponibles", methods=["GET"])
def disponibles():
    return jsonify(creneau_controller.lister_disponibles()), 200

@creneau_bp.route("", methods=["GET"])
@auth_required
def tous():
    return jsonify(creneau_controller.lister_tous()), 200

@creneau_bp.route("", methods=["POST"])
@auth_required
def creer():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Corps JSON requis"}), 400

    creneau_id, error = creneau_controller.creer_creneau(
        data.get("date_heure"), data.get("duree_minutes")
    )

    if error:
        return jsonify({"error": error}), 400

    return jsonify({"id": creneau_id}), 201
