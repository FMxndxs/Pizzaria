import { render, screen } from '@testing-library/react'
import { TopProductsTable } from '@/components/reports/TopProductsTable'

const rows = [
  { flavor_name: 'Calabresa', format_label: 'Pizza Grande', order_count: 10, total_qty: 12 },
  { flavor_name: 'Margherita', format_label: 'Pizza Média', order_count: 7, total_qty: 9 },
]

describe('TopProductsTable', () => {
  test('exibe cabeçalhos', () => {
    render(<TopProductsTable rows={rows} />)
    expect(screen.getByText(/sabor/i)).toBeInTheDocument()
    expect(screen.getByText(/formato/i)).toBeInTheDocument()
    expect(screen.getByText(/qtd/i)).toBeInTheDocument()
  })

  test('exibe sabores e formatos', () => {
    render(<TopProductsTable rows={rows} />)
    expect(screen.getByText('Calabresa')).toBeInTheDocument()
    expect(screen.getByText('Pizza Grande')).toBeInTheDocument()
  })

  test('exibe mensagem quando vazio', () => {
    render(<TopProductsTable rows={[]} />)
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
  })
})
