import { render, screen } from '@testing-library/react'
import { RevenueTable } from '@/components/reports/RevenueTable'

const rows = [
  { day: '2026-06-12', order_count: 5, revenue: 400, avg_ticket: 80 },
  { day: '2026-06-11', order_count: 3, revenue: 240, avg_ticket: 80 },
]

describe('RevenueTable', () => {
  test('exibe cabeçalhos da tabela', () => {
    render(<RevenueTable rows={rows} />)
    expect(screen.getByText(/dia/i)).toBeInTheDocument()
    expect(screen.getByText(/pedidos/i)).toBeInTheDocument()
    expect(screen.getByText(/faturamento/i)).toBeInTheDocument()
    expect(screen.getByText(/ticket médio/i)).toBeInTheDocument()
  })

  test('exibe dados de cada linha', () => {
    render(<RevenueTable rows={rows} />)
    expect(screen.getByText('12/06/2026')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  test('exibe mensagem quando não há dados', () => {
    render(<RevenueTable rows={[]} />)
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
  })
})
