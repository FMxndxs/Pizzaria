import { render, screen } from '@testing-library/react'
import { KitchenTicket } from '@/components/print/KitchenTicket'
import type { Order } from '@/types'

const base: Order = {
  id: 'o1', user_id: null, status: 'preparing', order_code: '#A001', order_seq: 1,
  customer_name: 'João Silva', customer_phone: '11999990000',
  total: 79.9, freight: 5, fulfillment_type: 'delivery', courier_name: null,
  cep: '01310100', street: 'Av. Paulista', street_number: '1000',
  neighborhood: 'Bela Vista', city: 'São Paulo',
  notes: 'Sem cebola',
  created_at: '2026-06-12T12:00:00Z', updated_at: '2026-06-12T12:00:00Z',
  items: [
    {
      id: 'i1', order_id: 'o1', format_code: 'pizza-grande', format_label: 'Pizza Grande',
      flavors: [{ name: 'Calabresa', price: 49.9, type: 'salgada' }, { name: 'Frango', price: 49.9, type: 'salgada' }],
      unit_price: 49.9, quantity: 1,
    },
    {
      id: 'i2', order_id: 'o1', format_code: 'pizza-media', format_label: 'Pizza Média',
      flavors: [{ name: 'Margherita', price: 39.9, type: 'salgada' }],
      unit_price: 39.9, quantity: 2,
    },
  ],
}

describe('KitchenTicket', () => {
  test('exibe order_code', () => {
    render(<KitchenTicket order={base} />)
    expect(screen.getByText(/#A001/)).toBeInTheDocument()
  })

  test('exibe nome do cliente', () => {
    render(<KitchenTicket order={base} />)
    expect(screen.getByText(/João Silva/)).toBeInTheDocument()
  })

  test('exibe todos os itens com formato e sabores', () => {
    render(<KitchenTicket order={base} />)
    expect(screen.getByText(/Pizza Grande/i)).toBeInTheDocument()
    expect(screen.getByText(/Calabresa/i)).toBeInTheDocument()
    expect(screen.getByText(/Frango/i)).toBeInTheDocument()
    expect(screen.getByText(/Pizza Média/i)).toBeInTheDocument()
    expect(screen.getByText(/Margherita/i)).toBeInTheDocument()
  })

  test('exibe quantidade do item', () => {
    render(<KitchenTicket order={base} />)
    expect(screen.getByText(/x2/i)).toBeInTheDocument()
  })

  test('exibe observações quando presentes', () => {
    render(<KitchenTicket order={base} />)
    expect(screen.getByText(/Sem cebola/)).toBeInTheDocument()
  })

  test('NÃO renderiza seção de observações quando notes é null', () => {
    render(<KitchenTicket order={{ ...base, notes: null }} />)
    expect(screen.queryByText(/observa/i)).not.toBeInTheDocument()
  })
})
