from app.database.connection import get_db

def create(demande_id, ancien_statut, nouveau_statut, commentaire=None):
    db = get_db()
    db.execute(
        """INSERT INTO demande_historique
           (demande_id, ancien_statut, nouveau_statut, commentaire_admin)
           VALUES (?, ?, ?, ?)""",
        (demande_id, ancien_statut, nouveau_statut, commentaire),
    )
    db.commit()

def find_by_demande_id(demande_id):
    db = get_db()
    return db.execute(
        "SELECT * FROM demande_historique WHERE demande_id = ? ORDER BY date_changement ASC",
        (demande_id,),
    ).fetchall()
