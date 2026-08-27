export default function Loader({ label = 'Chargement...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#6b6375]">
      <span className="animate-spin inline-block w-4 h-4 border-2 border-[#D6D2C4] border-t-[#1C1A17] rounded-full"></span>
      {label}
    </div>
  )
}
