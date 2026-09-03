import os
import uuid
from werkzeug.utils import secure_filename

MAX_SIZE_BYTES = 50 * 1024 * 1024

def valider_et_sauvegarder(fichier, upload_folder):
    if fichier is None or fichier.filename == "":
        return None, "Aucun fichier fourni"

    fichier.seek(0, os.SEEK_END)
    taille = fichier.tell()
    fichier.seek(0)
    if taille > MAX_SIZE_BYTES:
        return None, "Fichier trop volumineux (50 Mo maximum)"

    nom_securise = secure_filename(fichier.filename)
    nom_unique = uuid.uuid4().hex + "_" + nom_securise
    chemin_complet = os.path.join(upload_folder, nom_unique)
    os.makedirs(upload_folder, exist_ok=True)
    fichier.save(chemin_complet)

    return nom_unique, None
