import jwt
import datetime
from flask import current_app
from werkzeug.security import check_password_hash
from app.models.admin import find_by_email

def login(email, password):
    admin = find_by_email(email)

    if admin is None:
        return None, "Identifiants invalides"

    if not check_password_hash(admin["mot_de_passe_hash"], password):
        return None, "Identifiants invalides"

    payload = {
        "admin_id": admin["id"],
        "email": admin["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
    }
    token = jwt.encode(payload, current_app.config["JWT_SECRET"], algorithm="HS256")

    return token, None
