from app.database.connection import get_db

def create(token, nom, email, telephone, motif, message, fichier_path, creneau_id):
    db = get_db()
    cursor = db.execute(
        """INSERT INTO demandes
           (token, nom, email, telephone, motif, message, fichier_path, creneau_id, statut)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'En attente de traitement')""",
        (token, nom, email, telephone, motif, message, fichier_path, creneau_id),
    )
    db.commit()
    return cursor.lastrowid

def find_all():
    db = get_db()
    return db.execute(
        "SELECT * FROM demandes ORDER BY date_soumission DESC"
    ).fetchall()

def find_by_id(demande_id):
    db = get_db()
    return db.execute(
        "SELECT * FROM demandes WHERE id = ?", (demande_id,)
    ).fetchone()

def find_by_token(token):
    db = get_db()
    return db.execute(
        "SELECT * FROM demandes WHERE token = ?", (token,)
    ).fetchone()

def update_statut(demande_id, statut, commentaire_admin=None, date_traitement=None):
    db = get_db()
    if date_traitement:
        db.execute(
            "UPDATE demandes SET statut = ?, commentaire_admin = ?, date_traitement = ? WHERE id = ?",
            (statut, commentaire_admin, date_traitement, demande_id),
        )
    else:
        db.execute(
            "UPDATE demandes SET statut = ? WHERE id = ?",
            (statut, demande_id),
        )
    db.commit()

def find_by_creneau_id(creneau_id):
    db = get_db()
    return db.execute(
        "SELECT * FROM demandes WHERE creneau_id = ?", (creneau_id,)
    ).fetchall()
