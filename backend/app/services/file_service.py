import os
import uuid
import filetype
from werkzeug.utils import secure_filename

EXTENSIONS_DANGEREUSES = {
    "exe", "bat", "sh", "cmd", "msi", "php",
    "js", "jar", "com", "scr", "vbs", "ps1",
}

MIME_TYPES_AUTORISES = {
    "application/pdf",
    "application/zip",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

EXTENSIONS_SANS_SIGNATURE_AUTORISEES = {
    "txt", "docx", "doc", "csv",
}

MAX_SIZE_BYTES = 5 * 1024 * 1024

def extension_dangereuse(filename):
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in EXTENSIONS_DANGEREUSES

def obtenir_extension(filename):
    if "." not in filename:
        return ""
    return filename.rsplit(".", 1)[1].lower()

def valider_et_sauvegarder(fichier, upload_folder):
    if fichier is None or fichier.filename == "":
        return None, "Aucun fichier fourni"

    if extension_dangereuse(fichier.filename):
        return None, "Ce type de fichier n'est pas autorise pour des raisons de securite"

    fichier.seek(0, os.SEEK_END)
    taille = fichier.tell()
    fichier.seek(0)
    if taille > MAX_SIZE_BYTES:
        return None, "Fichier trop volumineux (5 Mo maximum)"

    entete = fichier.read(261)
    fichier.seek(0)
    kind = filetype.guess(entete)

    if kind is not None:
        if kind.mime not in MIME_TYPES_AUTORISES:
            return None, "Type de fichier non autorise (detecte: " + kind.mime + ")"
    else:
        extension = obtenir_extension(fichier.filename)
        if extension not in EXTENSIONS_SANS_SIGNATURE_AUTORISEES:
            return None, "Type de fichier non reconnu ou non autorise"

    nom_securise = secure_filename(fichier.filename)
    nom_unique = uuid.uuid4().hex + "_" + nom_securise
    chemin_complet = os.path.join(upload_folder, nom_unique)
    os.makedirs(upload_folder, exist_ok=True)
    fichier.save(chemin_complet)
    return nom_unique, None
