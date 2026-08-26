CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    mot_de_passe_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS creneaux (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_heure DATETIME NOT NULL,
    duree_minutes INTEGER NOT NULL,
    disponible BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS demandes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT,
    motif TEXT NOT NULL,
    message TEXT,
    fichier_path TEXT NOT NULL,
    creneau_id INTEGER NOT NULL,
    statut TEXT NOT NULL DEFAULT 'Soumise',
    commentaire_admin TEXT,
    date_soumission DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_traitement DATETIME,
    FOREIGN KEY (creneau_id) REFERENCES creneaux(id)
);
