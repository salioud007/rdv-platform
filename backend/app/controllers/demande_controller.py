import datetime
from app.models import demande, creneau
from app.services import file_service, token_service
from flask import current_app


def creer_demande(form_data, fichier):
    nom = form_data.get("nom")
    email = form_data.get("email")
    telephone = form_data.get("telephone")
    motif = form_data.get("motif")
    message = form_data.get("message")
    creneau_id = form_data.get("creneau_id")

    if not nom or not email or not motif or not creneau_id:
        return None, "Champs obligatoires manquants (nom, email, motif, creneau_id)"

    creneau_row = creneau.find_by_id(creneau_id)
    if creneau_row is None:
        return None, "Creneau introuvable"
    if not creneau_row["disponible"]:
        return None, "Ce creneau n'est plus disponible"

    nom_fichier, error = file_service.valider_et_sauvegarder(
        fichier, current_app.config["UPLOAD_FOLDER"]
    )
    if error:
        return None, error

    token = token_service.generer_token()

    demande_id = demande.create(
        token, nom, email, telephone, motif, message, nom_fichier, creneau_id
    )

    return {"id": demande_id, "token": token}, None


def lister_demandes():
    rows = demande.find_all()
    return [dict(row) for row in rows]


def obtenir_detail(demande_id):
    row = demande.find_by_id(demande_id)
    if row is None:
        return None

    if row["statut"] == "En attente de traitement":
        demande.update_statut(demande_id, "En cours d'examen")
        row = demande.find_by_id(demande_id)

    return dict(row)


def traiter_demande(demande_id, decision, commentaire):
    row = demande.find_by_id(demande_id)
    if row is None:
        return None, "Demande introuvable"

    if decision not in ("Acceptee", "Refusee"):
        return None, "Decision invalide (Acceptee ou Refusee attendu)"

    statut = "Acceptée" if decision == "Acceptee" else "Refusée"
    date_traitement = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    demande.update_statut(demande_id, statut, commentaire, date_traitement)

    if statut == "Acceptée":
        creneau.marquer_indisponible(row["creneau_id"])

    return dict(demande.find_by_id(demande_id)), None
