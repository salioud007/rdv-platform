from app.models import demande
from app.services import ics_service

def obtenir_par_token(token):
    row = demande.find_by_token(token)
    if row is None:
        return None
    data = dict(row)
    return {
        "id": data["id"],
        "nom": data["nom"],
        "motif": data["motif"],
        "statut": data["statut"],
        "commentaire_admin": data.get("commentaire_admin"),
        "date_soumission": data["date_soumission"],
        "date_traitement": data.get("date_traitement"),
        "fichier_joint": bool(data.get("fichier_path")),
    }

def obtenir_ics_par_token(token):
    """
    Retourne (contenu_ics, None) en cas de succès,
    ou (None, (message_erreur, code_http)) en cas d'échec.
    """
    row = demande.find_by_token(token)
    if row is None:
        return None, ("Token invalide ou demande introuvable", 404)

    contenu, erreur = ics_service.generer_ics(row)
    if erreur:
        return None, (erreur, 400)

    return contenu, None
