from app import create_app
from app.database.seed import run_seed

app = create_app()
run_seed(app)
print("Seed termine.")
