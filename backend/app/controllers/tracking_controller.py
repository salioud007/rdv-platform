from app.models import demande

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
        "fichier_joint": bool(data.get("fichier_path")),  # booléen, pas le chemin réel
    }
