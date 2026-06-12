import { render, screen } from '@testing-library/react'
import { KitchenBoard } from '@/components/kds/KitchenBoard'
import type { Order } from '@/types'

// Supabase Realtime não deve ser ativado nos testes
jest.mock('@/lib/supabase/browser', () => ({
  createClient: jest.fn(() => ({
    channel: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
    removeChannel: jest.fn(),
  })),
}))

jest.mock('@/app/actions/orders', () => ({
  advanceOrderStatusAction: jest.fn().mockResolvedValue({ ok: true, data: {} }),
}))

function makeOrder(id: string, status: Order['status'], code: string): Order {
  return {
    id,
    user_id:          null,
    status,
    order_code:       code,
    order_seq:        1,
    customer_name:    'Cliente Teste',
    customer_phone:   '11999990000',
    total:            39.9,
    freight:          null,
    cep:              '01310100',
    street:           'Rua A',
    street_number:    '1',
    neighborhood:     'Centro',
    city:             'SP',
    notes:            null,
    fulfillment_type: 'delivery',
    courier_name:     null,
    created_at:       '2026-06-12T12:00:00Z',
    updated_at:       '2026-06-12T12:00:00Z',
    items:            [],
  }
}

const confirmed  = makeOrder('o1', 'confirmed',  'C001')
const preparing  = makeOrder('o2', 'preparing',  'P002')

describe('KitchenBoard — lanes', () => {
  test('renderiza heading da lane Confirmados', () => {
    render(<KitchenBoard initialOrders={[confirmed]} />)
    expect(screen.getByText(/confirmados/i)).toBeInTheDocument()
  })

  test('renderiza heading da lane Preparando', () => {
    render(<KitchenBoard initialOrders={[preparing]} />)
    expect(screen.getByText(/preparando/i)).toBeInTheDocument()
  })

  test('pedido confirmed aparece na lane Confirmados', () => {
    render(<KitchenBoard initialOrders={[confirmed]} />)
    expect(screen.getByText(/C001/)).toBeInTheDocument()
  })

  test('pedido preparing aparece na lane Preparando', () => {
    render(<KitchenBoard initialOrders={[preparing]} />)
    expect(screen.getByText(/P002/)).toBeInTheDocument()
  })

  test('pedido ready NÃO aparece no board', () => {
    const ready = makeOrder('o3', 'ready', 'R003')
    render(<KitchenBoard initialOrders={[ready]} />)
    expect(screen.queryByText(/R003/)).not.toBeInTheDocument()
  })

  test('pedido cancelled NÃO aparece no board', () => {
    const cancelled = makeOrder('o4', 'cancelled', 'X004')
    render(<KitchenBoard initialOrders={[cancelled]} />)
    expect(screen.queryByText(/X004/)).not.toBeInTheDocument()
  })

  test('renderiza ambas as lanes com pedidos mistos', () => {
    render(<KitchenBoard initialOrders={[confirmed, preparing]} />)
    expect(screen.getByText(/C001/)).toBeInTheDocument()
    expect(screen.getByText(/P002/)).toBeInTheDocument()
  })

  test('lane vazia mostra mensagem de fila vazia', () => {
    render(<KitchenBoard initialOrders={[preparing]} />)
    // Lane "Confirmados" deve indicar que está vazia
    expect(screen.getByText(/nenhum pedido/i)).toBeInTheDocument()
  })
})
