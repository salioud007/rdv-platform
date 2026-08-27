export default function Button({ children, variant = 'primary', type = 'button', onClick, disabled }) {
  const base = 'px-4 py-2 rounded-sm font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-[#1C1A17] text-[#F7F5F0] hover:bg-[#332F29]',
    secondary: 'bg-transparent text-[#1C1A17] border border-[#D6D2C4] hover:bg-[#EFEBE1]',
    danger: 'bg-[#991B1B] text-white hover:bg-[#7F1616]',
    success: 'bg-[#166534] text-white hover:bg-[#134E2B]',
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
