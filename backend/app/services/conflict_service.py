from collections import defaultdict

def calculer_conflits(demandes):
    """
    demandes : liste de dicts, chacun avec au moins 'id' et 'date_creneau' (ex: '2026-09-03').
    Retourne un dict {demande_id: nombre_autres_demandes_le_meme_jour}.
    Une demande seule ce jour-la -> 0. Deux demandes le meme jour -> 1 chacune. Etc.
    """
    par_date = defaultdict(list)
    for d in demandes:
        date = d.get("date_creneau")
        if date:
            par_date[date].append(d["id"])

    conflits = {}
    for date, ids in par_date.items():
        for demande_id in ids:
            conflits[demande_id] = len(ids) - 1

    return conflits
