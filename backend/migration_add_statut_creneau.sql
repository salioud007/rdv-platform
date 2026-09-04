ALTER TABLE creneaux ADD COLUMN statut TEXT NOT NULL DEFAULT 'Ouvert';
UPDATE creneaux SET statut = 'Reserve' WHERE disponible = 0;
