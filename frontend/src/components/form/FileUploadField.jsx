export default function FileUploadField({ fichier, onChange, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="fichier" className="text-sm font-medium text-[#1C1A17]">
        Pièce jointe (pdf ou zip, 5 Mo max)
      </label>
      <input
        id="fichier"
        type="file"
        accept=".pdf,.zip"
        onChange={(e) => onChange(e.target.files[0] || null)}
        className={`border rounded-sm px-3 py-2 text-sm bg-white file:mr-3 file:px-3 file:py-1 file:rounded-sm file:border-0 file:bg-[#1C1A17] file:text-[#F7F5F0] file:text-xs ${
          error ? 'border-[#991B1B]' : 'border-[#D6D2C4]'
        }`}
      />
      {fichier && (
        <span className="text-xs text-[#6b6375]">
          Fichier sélectionné : {fichier.name}
        </span>
      )}
      {error && <span className="text-xs text-[#991B1B]">{error}</span>}
    </div>
  )
}
