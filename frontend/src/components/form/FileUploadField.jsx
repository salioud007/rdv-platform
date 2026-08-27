export default function FileUploadField({ fichier, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="fichier" className="text-sm font-medium text-ink">
        Pièce jointe (pdf ou zip, 5 Mo max)
      </label>
      <input
        id="fichier"
        type="file"
        accept=".pdf,.zip"
        onChange={(e) => onChange(e.target.files[0] || null)}
        className={`border rounded-lg px-3.5 py-2.5 text-sm bg-white transition-shadow duration-150 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-ink file:text-white file:text-xs file:font-medium ${
          error ? 'border-danger' : 'border-border'
        }`}
      />
      {fichier && (
        <span className="text-xs text-ink-muted font-mono">
          {fichier.name}
        </span>
      )}
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
