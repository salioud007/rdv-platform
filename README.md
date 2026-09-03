# RDV-Platform

Plateforme de reservation et de planification de rendez-vous.
Un demandeur (client) soumet une demande de rendez-vous via un formulaire public.
Un administrateur unique traite les demandes via une interface dediee.
Le suivi se fait par lien unique (token), sans creation de compte ni envoi d'email.

Voir `docs/Cahier_des_charges_RDV_Platform.docx` pour le detail fonctionnel complet.

## Stack technique

- Frontend : React + Vite + Tailwind CSS
- Backend : Python + Flask
- Base de donnees : SQLite

## Prerequis

- Node.js (v18 ou superieur recommande)
- Python 3.10 ou superieur
- npm

## Installation du backend

```bash
cd backend
python -m venv venv
```

Activation de l'environnement virtuel :

```bash
# Windows (Git Bash)
source venv/Scripts/activate

# Linux / macOS
source venv/bin/activate
```

Installation des dependances :

```bash
pip install -r requirements.txt
```

Creer un fichier `.env` dans `backend/` avec le contenu suivant :

SECRET_KEY=change-moi-en-production
JWT_SECRET=change-moi-aussi
DB_PATH=./database.sqlite
UPLOAD_FOLDER=./uploads


Initialiser la base de donnees avec des donnees de test :

```bash
   ./venv/Scripts/python.exe run.py "
from app import create_app
from app.database.seed import run_seed
app = create_app()
run_seed(app)
"
```

Compte administrateur cree par le seed :
- Email : `admin@rdv-platform.local`
- Mot de passe : `Admin2026!`

Lancer le serveur :

```bash
./venv/Scripts/python.exe run.py
```

Le backend est accessible sur `http://localhost:5000`.

## Installation du frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend est accessible sur `http://localhost:5173`.

## Notes importantes

- Le rate limiting est fixe a 5 requetes par heure et par IP sur la creation de demande.
- Un fichier joint (pdf ou zip, 5 Mo maximum) est obligatoire pour chaque demande.
- Le type reel du fichier est verifie cote serveur (pas seulement l'extension).
- Un creneau est reserve des la soumission d'une demande (et non a l'acceptation).
  Ce comportement differe du cahier des charges original par choix assume,
  pour eviter que l'administrateur ait a arbitrer entre plusieurs demandes
  sur un meme creneau. Un creneau redevient disponible si la demande est refusee.
- Le mot de passe administrateur est stocke hache (scrypt), jamais en clair.
- Les fichiers uploades sont stockes dans `backend/uploads/` et ne sont jamais
  commites sur Git (voir `.gitignore`).

## Structure du depot

rdv-platform/
├── frontend/ Application React
├── backend/ API Flask
├── docs/ Cahier des charges, architecture, plan de realisation
└── README.md Ce fichier

