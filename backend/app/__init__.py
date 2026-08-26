from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.database.connection import init_db, close_db
from app.middlewares.rate_limiter import limiter

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    init_db(app)
    app.teardown_appcontext(close_db)

    limiter.init_app(app)

    from app.routes.auth_routes import auth_bp
    from app.routes.creneau_routes import creneau_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(creneau_bp, url_prefix="/api/creneaux")

    return app
