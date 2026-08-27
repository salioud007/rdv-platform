export default function Input({ label, id, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`border rounded-lg px-3.5 py-2.5 text-sm bg-white transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent ${
          error ? 'border-danger' : 'border-border'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
