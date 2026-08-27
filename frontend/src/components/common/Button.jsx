export default function Button({ children, variant = 'primary', type = 'button', onClick, disabled }) {
  const base = 'px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
  const variants = {
    primary: 'bg-ink text-white hover:bg-ink-hover shadow-sm hover:shadow-md',
    secondary: 'bg-transparent text-ink border border-border hover:bg-secondary-hover',
    danger: 'bg-danger text-white hover:bg-danger-hover',
    success: 'bg-success text-white hover:bg-success-hover',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}
