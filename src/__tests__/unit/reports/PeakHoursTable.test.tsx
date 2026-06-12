import { render, screen } from '@testing-library/react'
import { PeakHoursTable } from '@/components/reports/PeakHoursTable'

const rows = [
  { hour: 18, order_count: 6 },
  { hour: 19, order_count: 12 },
  { hour: 20, order_count: 8 },
]

describe('PeakHoursTable', () => {
  test('exibe coluna de hora e pedidos', () => {
    render(<PeakHoursTable rows={rows} />)
    expect(screen.getByText(/hora/i)).toBeInTheDocument()
    expect(screen.getByText(/pedidos/i)).toBeInTheDocument()
  })

  test('exibe hora formatada como HH:00', () => {
    render(<PeakHoursTable rows={rows} />)
    expect(screen.getByText('18:00')).toBeInTheDocument()
    expect(screen.getByText('19:00')).toBeInTheDocument()
  })

  test('destaca o horário de pico (maior contagem)', () => {
    render(<PeakHoursTable rows={rows} />)
    const peakRow = screen.getByTestId('peak-row')
    expect(peakRow).toHaveTextContent('19:00')
  })

  test('exibe mensagem quando vazio', () => {
    render(<PeakHoursTable rows={[]} />)
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
  })
})
