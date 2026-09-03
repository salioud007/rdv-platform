import datetime
from app.models import demande, creneau, demande_historique
from app.services import file_service, token_service, conflict_service
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

    reservation_reussie = creneau.reserver_si_disponible(creneau_id)
    if not reservation_reussie:
        return None, "Ce creneau vient d'etre pris par quelqu'un d'autre"

    nom_fichier, error = file_service.valider_et_sauvegarder(
        fichier, current_app.config["UPLOAD_FOLDER"]
    )
    if error:
        creneau.liberer(creneau_id)
        return None, error

    token = token_service.generer_token()
    demande_id = demande.create(
        token, nom, email, telephone, motif, message, nom_fichier, creneau_id
    )
    return {"id": demande_id, "token": token}, None

def lister_demandes():
    rows = demande.find_all()
    demandes = []
    for row in rows:
        d = dict(row)
        creneau_row = creneau.find_by_id(d["creneau_id"])
        d["date_creneau"] = creneau_row["date_heure"].split(" ")[0] if creneau_row else None
        d["date_heure_creneau"] = creneau_row["date_heure"] if creneau_row else None
        demandes.append(d)

    conflits = conflict_service.calculer_conflits(demandes)
    for d in demandes:
        d["conflits"] = conflits.get(d["id"], 0)

    return demandes

def obtenir_detail(demande_id):
    row = demande.find_by_id(demande_id)
    if row is None:
        return None
    if row["statut"] == "En attente de traitement":
        demande.update_statut(demande_id, "En cours d'examen")
        demande_historique.create(demande_id, row["statut"], "En cours d'examen")
        row = demande.find_by_id(demande_id)
    return dict(row)

def traiter_demande(demande_id, decision, commentaire):
    row = demande.find_by_id(demande_id)
    if row is None:
        return None, "Demande introuvable"
    if decision not in ("Acceptee", "Refusee"):
        return None, "Decision invalide (Acceptee ou Refusee attendu)"

    ancien_statut = row["statut"]
    nouveau_statut = "Acceptée" if decision == "Acceptee" else "Refusée"

    # Ré-acceptation après un refus : le creneau a ete libere au moment du refus,
    # il faut donc le re-reserver avant de confirmer l'acceptation.
    if nouveau_statut == "Acceptée" and ancien_statut == "Refusée":
        reservation_reussie = creneau.reserver_si_disponible(row["creneau_id"])
        if not reservation_reussie:
            return None, "Ce creneau n'est plus disponible (pris par une autre demande entre-temps)"

    date_traitement = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    demande.update_statut(demande_id, nouveau_statut, commentaire, date_traitement)
    demande_historique.create(demande_id, ancien_statut, nouveau_statut, commentaire)

    if nouveau_statut == "Refusée":
        creneau.liberer(row["creneau_id"])

    return dict(demande.find_by_id(demande_id)), None

def obtenir_historique(demande_id):
    row = demande.find_by_id(demande_id)
    if row is None:
        return None
    return [dict(h) for h in demande_historique.find_by_demande_id(demande_id)]
