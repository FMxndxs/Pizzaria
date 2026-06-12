'use client'

export function PrintButton({ label = '🖨️ Imprimir' }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-xl bg-stone-800 text-white px-6 py-2 text-sm font-semibold hover:bg-stone-700 transition-colors print:hidden"
    >
      {label}
    </button>
  )
}
