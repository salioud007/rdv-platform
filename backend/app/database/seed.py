from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from app.database.connection import get_db

def seed_admin(db):
    email = "admin@rdv-platform.local"
    password_hash = generate_password_hash("Admin2026!")

    existing = db.execute(
        "SELECT id FROM admin WHERE email = ?", (email,)
    ).fetchone()

    if existing:
        print(f"Admin '{email}' existe deja, aucun ajout.")
        return

    db.execute(
        "INSERT INTO admin (email, mot_de_passe_hash) VALUES (?, ?)",
        (email, password_hash),
    )
    print(f"Admin '{email}' cree.")

def seed_creneaux(db):
    existing = db.execute("SELECT COUNT(*) as count FROM creneaux").fetchone()
    if existing["count"] > 0:
        print("Des creneaux existent deja, aucun ajout.")
        return

    base_date = datetime.now() + timedelta(days=7)
    creneaux = [
        (base_date + timedelta(days=i), 30)
        for i in range(6)
    ]

    for date_heure, duree in creneaux:
        db.execute(
            "INSERT INTO creneaux (date_heure, duree_minutes, disponible) VALUES (?, ?, 1)",
            (date_heure.strftime("%Y-%m-%d %H:%M:%S"), duree),
        )
    print(f"{len(creneaux)} creneaux crees.")

def run_seed(app):
    with app.app_context():
        db = get_db()
        seed_admin(db)
        seed_creneaux(db)
        db.commit()
