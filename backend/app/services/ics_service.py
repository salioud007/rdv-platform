from datetime import datetime, timedelta
from ics import Calendar, Event
from app.models import creneau as creneau_model

def generer_ics(demande_row):
    """
    Génère le contenu .ics pour une demande acceptée.
    Retourne (contenu_ics: str, None) ou (None, message_erreur: str)
    """
    demande = dict(demande_row)

    if demande["statut"] != "Acceptée":
        return None, "Le fichier .ics n'est disponible que pour une demande acceptée."

    creneau_row = creneau_model.find_by_id(demande["creneau_id"])
    if creneau_row is None:
        return None, "Créneau associé introuvable."

    creneau = dict(creneau_row)

    debut = datetime.strptime(creneau["date_heure"], "%Y-%m-%d %H:%M:%S")
    fin = debut + timedelta(minutes=creneau["duree_minutes"])

    cal = Calendar()
    event = Event()
    event.name = f"Rendez-vous — {demande['motif']}"
    event.begin = debut.isoformat()
    event.end = fin.isoformat()
    event.description = demande.get("commentaire_admin") or ""

    cal.events.add(event)

    return str(cal), None
