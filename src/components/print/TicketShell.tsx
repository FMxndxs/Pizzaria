import { PrintButton } from './PrintButton'

const PRINT_CSS = `
  @media print {
    body > *:not(.print-root) { display: none !important; }
    .print-root { display: block !important; }
    .print-ticket { page-break-inside: avoid; }
  }
  @media screen {
    body { background: #f5f5f5; }
    .print-root { padding: 2rem; }
  }
`

export function TicketShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{PRINT_CSS}</style>
      <div className="print-root">
        <div className="mb-4 flex gap-3 justify-center">
          <PrintButton label="🖨️ Imprimir ticket" />
        </div>
        {children}
      </div>
    </>
  )
}
