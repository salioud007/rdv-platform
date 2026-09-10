# RDV-Platform

Plateforme de reservation et de planification de rendez-vous.
Un demandeur (client) soumet une demande de rendez-vous via un formulaire public.
Un administrateur unique traite les demandes via une interface dediee.
Le suivi se fait par lien unique (token), sans creation de compte ni envoi d'email.

Voir `docs/Cahier_des_charges_RDV_Platform.docx` pour le detail fonctionnel complet.

## Stack technique

- Frontend : React + Vite + Tailwind CSS + Mantine UI
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
ou ./venv/Scripts/python.exe run.py
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

Creer un fichier `.env` dans `backend/` avec le contenu suivant :

```
SECRET_KEY=change-moi-en-production
JWT_SECRET=change-moi-aussi
DB_PATH=./database.sqlite
UPLOAD_FOLDER=./uploads
```

Initialiser la base de donnees avec des donnees de test :

```bash
./venv/Scripts/python.exe seed_runner.py
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
```

Creer un fichier `.env` dans `frontend/` avec le contenu suivant :
VITE_API_URL=http://localhost:5000/api

Lancer le serveur de developpement :

```bash
npm run dev
```

Le frontend est accessible sur `http://localhost:5173`.

## Notes importantes

- Le rate limiting est fixe a 5 requetes par heure et par IP sur la creation de demande (`POST /api/demandes`).
- Un fichier joint (pdf ou zip, 5 Mo maximum) est obligatoire pour chaque demande.
- Le type reel du fichier est verifie cote serveur (pas seulement l'extension).
- Un creneau est reserve des la soumission d'une demande (et non a l'acceptation).
  Ce comportement differe du cahier des charges original par choix assume,
  pour eviter que l'administrateur ait a arbitrer entre plusieurs demandes
  sur un meme creneau. Un creneau redevient disponible si la demande est refusee.
- Chaque creneau a un statut (`Ouvert` / `Reserve` / `Annule`), consultable et
  modifiable par l'administrateur (annulation possible depuis l'interface).
- L'historique des changements de statut d'une demande (avec commentaire admin)
  est conserve et consultable via `GET /api/demandes/:id/historique`.
- Les pages de suivi (demandeur) et le tableau de bord (admin) se rafraichissent
  automatiquement toutes les 3 secondes (polling), sans action manuelle.
- La session administrateur est conservee dans le navigateur (localStorage,
  24h) pour eviter une reconnexion a chaque rechargement de page. En cas
  d'expiration du token, l'administrateur est redirige automatiquement vers
  la page de connexion.
- Le mot de passe administrateur est stocke hache (scrypt), jamais en clair.
- Les fichiers uploades sont stockes dans `backend/uploads/` et ne sont jamais
  commites sur Git (voir `.gitignore`).

## Structure du depot
rdv-platform/
├── frontend/ Application React
├── backend/ API Flask
├── docs/ docs
└── README.md 