from datetime import datetime
from app.models import creneau, demande

STATUTS_BLOQUANTS = ("En attente de traitement", "En cours d'examen", "Acceptée")

def lister_disponibles():
    rows = creneau.find_all_disponibles()
    return [dict(row) for row in rows]

def lister_tous():
    rows = creneau.find_all()
    return [dict(row) for row in rows]

def creer_creneau(date_heure, duree_minutes):
    if not date_heure or not duree_minutes:
        return None, "date_heure et duree_minutes requis"

    try:
        date_parsee = datetime.strptime(date_heure, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None, "Format de date invalide (attendu: YYYY-MM-DD HH:MM:SS)"

    maintenant = datetime.now()

    if date_parsee <= maintenant:
        return None, "La date du creneau doit etre dans le futur"

    limite_haute = maintenant.replace(year=maintenant.year + 2)
    if date_parsee > limite_haute:
        return None, "La date du creneau ne peut pas depasser 2 ans dans le futur"

    try:
        duree = int(duree_minutes)
    except (ValueError, TypeError):
        return None, "La duree doit etre un nombre entier de minutes"

    if duree <= 0:
        return None, "La duree doit etre superieure a 0"

    if duree > 480:
        return None, "La duree ne peut pas depasser 480 minutes (8 heures)"

    creneau_id = creneau.create(date_heure, duree)
    return creneau_id, None

def supprimer_creneau(creneau_id):
    creneau_row = creneau.find_by_id(creneau_id)
    if creneau_row is None:
        return None, "Creneau introuvable", 404

    demandes_liees = demande.find_by_creneau_id(creneau_id)
    demandes_actives = [d for d in demandes_liees if d["statut"] in STATUTS_BLOQUANTS]

    if demandes_actives:
        return None, (
            f"{len(demandes_actives)} demande(s) active(s) sur ce creneau. "
            "Traitez-les avant de le supprimer."
        ), 409

    if demandes_liees:
        creneau.marquer_annule(creneau_id)
        return {"annule": True}, None, 200

    creneau.supprimer(creneau_id)
    return {"supprime": True}, None, 200
