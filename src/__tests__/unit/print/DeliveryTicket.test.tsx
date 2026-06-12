import { render, screen } from '@testing-library/react'
import { DeliveryTicket } from '@/components/print/DeliveryTicket'
import type { Order } from '@/types'

const deliveryOrder: Order = {
  id: 'o1', user_id: null, status: 'out_for_delivery', order_code: '#B002', order_seq: 2,
  customer_name: 'Maria Santos', customer_phone: '11988880000',
  total: 89.9, freight: 8, fulfillment_type: 'delivery', courier_name: 'Carlos Moto',
  cep: '01310100', street: 'Rua Augusta', street_number: '500',
  neighborhood: 'Consolação', city: 'São Paulo', notes: null,
  created_at: '2026-06-12T12:00:00Z', updated_at: '2026-06-12T12:00:00Z',
  items: [{
    id: 'i1', order_id: 'o1', format_code: 'pizza-grande', format_label: 'Pizza Grande',
    flavors: [{ name: 'Portuguesa', price: 49.9, type: 'salgada' }],
    unit_price: 49.9, quantity: 1,
  }],
}

const pickupOrder: Order = {
  ...deliveryOrder,
  fulfillment_type: 'pickup', courier_name: null, status: 'ready',
  street: '', street_number: '', neighborhood: '', city: '', cep: '',
}

describe('DeliveryTicket — delivery', () => {
  test('exibe order_code', () => {
    render(<DeliveryTicket order={deliveryOrder} />)
    expect(screen.getByText(/#B002/)).toBeInTheDocument()
  })

  test('exibe nome do cliente', () => {
    render(<DeliveryTicket order={deliveryOrder} />)
    expect(screen.getByText(/Maria Santos/)).toBeInTheDocument()
  })

  test('exibe endereço completo', () => {
    render(<DeliveryTicket order={deliveryOrder} />)
    expect(screen.getByText(/Rua Augusta/)).toBeInTheDocument()
    expect(screen.getByText(/500/)).toBeInTheDocument()
    expect(screen.getByText(/Consolação/)).toBeInTheDocument()
  })

  test('exibe total formatado', () => {
    render(<DeliveryTicket order={deliveryOrder} />)
    expect(screen.getByText(/89/)).toBeInTheDocument()
  })

  test('exibe courier_name quando presente', () => {
    render(<DeliveryTicket order={deliveryOrder} />)
    expect(screen.getByText(/Carlos Moto/)).toBeInTheDocument()
  })

  test('NÃO exibe courier quando null', () => {
    render(<DeliveryTicket order={{ ...deliveryOrder, courier_name: null }} />)
    expect(screen.queryByText(/Carlos Moto/)).not.toBeInTheDocument()
  })
})

describe('DeliveryTicket — pickup', () => {
  test('exibe "Retirada no balcão" para pedido pickup', () => {
    render(<DeliveryTicket order={pickupOrder} />)
    expect(screen.getByText(/retirada no balcão/i)).toBeInTheDocument()
  })

  test('NÃO exibe campo de endereço para pickup', () => {
    render(<DeliveryTicket order={pickupOrder} />)
    expect(screen.queryByText(/Rua Augusta/)).not.toBeInTheDocument()
  })
})
