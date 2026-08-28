from datetime import datetime
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
