from app.models import creneau

def lister_disponibles():
    rows = creneau.find_all_disponibles()
    return [dict(row) for row in rows]

def lister_tous():
    rows = creneau.find_all()
    return [dict(row) for row in rows]

def creer_creneau(date_heure, duree_minutes):
    if not date_heure or not duree_minutes:
        return None, "date_heure et duree_minutes requis"

    creneau_id = creneau.create(date_heure, duree_minutes)
    return creneau_id, None
