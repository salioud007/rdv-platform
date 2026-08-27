export default function Button({ children, variant = 'primary', type = 'button', onClick, disabled }) {
  const base = 'px-4 py-2 rounded-sm font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-ink text-surface hover:bg-ink-hover',
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
