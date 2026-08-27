export default function Input({ label, id, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#1C1A17]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`border rounded-sm px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#B45309] ${
          error ? 'border-[#991B1B]' : 'border-[#D6D2C4]'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-[#991B1B]">{error}</span>}
    </div>
  )
}
