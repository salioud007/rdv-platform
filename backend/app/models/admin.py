from app.database.connection import get_db

def find_by_email(email):
    db = get_db()
    return db.execute(
        "SELECT * FROM admin WHERE email = ?", (email,)
    ).fetchone()
