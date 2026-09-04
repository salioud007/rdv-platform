from app.database.connection import get_db

def create(date_heure, duree_minutes):
    db = get_db()
    cursor = db.execute(
        "INSERT INTO creneaux (date_heure, duree_minutes, disponible, statut) VALUES (?, ?, 1, 'Ouvert')",
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

def marquer_reserve(creneau_id):
    db = get_db()
    db.execute(
        "UPDATE creneaux SET disponible = 0, statut = 'Reserve' WHERE id = ?",
        (creneau_id,),
    )
    db.commit()

def marquer_annule(creneau_id):
    db = get_db()
    db.execute(
        "UPDATE creneaux SET disponible = 0, statut = 'Annule' WHERE id = ?",
        (creneau_id,),
    )
    db.commit()

def reserver_si_disponible(creneau_id):
    db = get_db()
    cursor = db.execute(
        "UPDATE creneaux SET disponible = 0, statut = 'Reserve' WHERE id = ? AND disponible = 1",
        (creneau_id,),
    )
    db.commit()
    return cursor.rowcount == 1

def liberer(creneau_id):
    db = get_db()
    db.execute(
        "UPDATE creneaux SET disponible = 1, statut = 'Ouvert' WHERE id = ?",
        (creneau_id,),
    )
    db.commit()

def supprimer(creneau_id):
    db = get_db()
    db.execute("DELETE FROM creneaux WHERE id = ?", (creneau_id,))
    db.commit()
