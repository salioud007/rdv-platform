export default function FileUploadField({ fichier, onChange, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="fichier" className="text-sm font-medium text-ink">
        Pièce jointe (pdf ou zip, 5 Mo max)
      </label>
      <input
        id="fichier"
        type="file"
        accept=".pdf,.zip"
        onChange={(e) => onChange(e.target.files[0] || null)}
        className={`border rounded-sm px-3 py-2 text-sm bg-white file:mr-3 file:px-3 file:py-1 file:rounded-sm file:border-0 file:bg-ink file:text-surface file:text-xs ${
          error ? 'border-danger' : 'border-border'
        }`}
      />
      {fichier && (
        <span className="text-xs text-ink-muted">
          Fichier sélectionné : {fichier.name}
        </span>
      )}
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
