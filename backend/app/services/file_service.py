import os
import uuid
import filetype
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"pdf", "zip"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/zip",
}
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 Mo


def extension_autorisee(filename):
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS


def valider_et_sauvegarder(fichier, upload_folder):
    if fichier is None or fichier.filename == "":
        return None, "Aucun fichier fourni"

    if not extension_autorisee(fichier.filename):
        return None, "Extension non autorisee (pdf ou zip uniquement)"

    fichier.seek(0, os.SEEK_END)
    taille = fichier.tell()
    fichier.seek(0)

    if taille > MAX_SIZE_BYTES:
        return None, "Fichier trop volumineux (5 Mo maximum)"

    entete = fichier.read(261)
    fichier.seek(0)

    kind = filetype.guess(entete)

    if kind is None or kind.mime not in ALLOWED_MIME_TYPES:
        detecte = kind.mime if kind else "inconnu"
        return None, f"Type de fichier non autorise (detecte: {detecte})"

    nom_securise = secure_filename(fichier.filename)
    nom_unique = f"{uuid.uuid4().hex}_{nom_securise}"
    chemin_complet = os.path.join(upload_folder, nom_unique)

    os.makedirs(upload_folder, exist_ok=True)
    fichier.save(chemin_complet)

    return nom_unique, None
