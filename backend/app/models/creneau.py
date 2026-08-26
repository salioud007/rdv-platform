from app.database.connection import get_db

def create(date_heure, duree_minutes):
    db = get_db()
    cursor = db.execute(
        "INSERT INTO creneaux (date_heure, duree_minutes, disponible) VALUES (?, ?, 1)",
        (date_heure, duree_minutes),
    )
    db.commit()
    return cursor.lastrowid

def find_all_disponibles():
    db = get_db()
    return db.execute(
        "SELECT * FROM creneaux WHERE disponible = 1 ORDER BY date_heure ASC"
    ).fetchall()

def find_all():
    db = get_db()
    return db.execute(
        "SELECT * FROM creneaux ORDER BY date_heure ASC"
    ).fetchall()

def find_by_id(creneau_id):
    db = get_db()
    return db.execute(
        "SELECT * FROM creneaux WHERE id = ?", (creneau_id,)
    ).fetchone()

def marquer_indisponible(creneau_id):
    db = get_db()
    db.execute(
        "UPDATE creneaux SET disponible = 0 WHERE id = ?", (creneau_id,)
    )
    db.commit()
