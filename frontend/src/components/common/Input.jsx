export default function Input({ label, id, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`border rounded-sm px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent ${
          error ? 'border-danger' : 'border-border'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
