import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { KitchenCard } from '@/components/kds/KitchenCard'
import type { Order } from '@/types'

// Isola a Server Action — os testes cobrem chamada correta, não persistência
jest.mock('@/app/actions/orders', () => ({
  advanceOrderStatusAction: jest.fn().mockResolvedValue({ ok: true, data: {} }),
}))

const base: Order = {
  id:               'ord-1',
  user_id:          null,
  status:           'confirmed',
  order_code:       'A001',
  order_seq:        1,
  customer_name:    'João Silva',
  customer_phone:   '11999990000',
  total:            49.9,
  freight:          null,
  cep:              '01310100',
  street:           'Av. Paulista',
  street_number:    '1000',
  neighborhood:     'Bela Vista',
  city:             'São Paulo',
  notes:            null,
  fulfillment_type: 'delivery',
  courier_name:     null,
  created_at:       '2026-06-12T12:00:00Z',
  updated_at:       '2026-06-12T12:00:00Z',
  items:            [{
    id:           'item-1',
    order_id:     'ord-1',
    format_code:  'pizza-grande',
    format_label: 'Pizza Grande',
    flavors:      [{ name: 'Calabresa', price: 49.9, type: 'salgada' }],
    unit_price:   49.9,
    quantity:     1,
    created_at:   '2026-06-12T12:00:00Z',
  }],
}

describe('KitchenCard — conteúdo', () => {
  test('exibe order_code', () => {
    render(<KitchenCard order={base} />)
    expect(screen.getByText(/A001/)).toBeInTheDocument()
  })

  test('exibe nome do cliente', () => {
    render(<KitchenCard order={base} />)
    expect(screen.getByText(/João Silva/)).toBeInTheDocument()
  })

  test('exibe o formato e sabor do item', () => {
    render(<KitchenCard order={base} />)
    expect(screen.getByText(/Calabresa/i)).toBeInTheDocument()
  })
})

describe('KitchenCard — botão "Iniciar preparo"', () => {
  test('aparece em pedidos confirmed', () => {
    render(<KitchenCard order={base} />)
    expect(screen.getByRole('button', { name: /iniciar preparo/i })).toBeInTheDocument()
  })

  test('NÃO aparece em pedidos preparing', () => {
    render(<KitchenCard order={{ ...base, status: 'preparing' }} />)
    expect(screen.queryByRole('button', { name: /iniciar preparo/i })).not.toBeInTheDocument()
  })

  test('clique chama advanceOrderStatusAction com "preparing"', async () => {
    const { advanceOrderStatusAction } = await import('@/app/actions/orders')
    render(<KitchenCard order={base} />)
    fireEvent.click(screen.getByRole('button', { name: /iniciar preparo/i }))
    await waitFor(() => {
      expect(advanceOrderStatusAction).toHaveBeenCalledWith('ord-1', 'preparing')
    })
  })
})

describe('KitchenCard — botão "Marcar pronto"', () => {
  test('aparece em pedidos preparing', () => {
    render(<KitchenCard order={{ ...base, status: 'preparing' }} />)
    expect(screen.getByRole('button', { name: /marcar pronto/i })).toBeInTheDocument()
  })

  test('NÃO aparece em pedidos confirmed', () => {
    render(<KitchenCard order={base} />)
    expect(screen.queryByRole('button', { name: /marcar pronto/i })).not.toBeInTheDocument()
  })

  test('clique chama advanceOrderStatusAction com "ready"', async () => {
    const { advanceOrderStatusAction } = await import('@/app/actions/orders')
    render(<KitchenCard order={{ ...base, status: 'preparing' }} />)
    fireEvent.click(screen.getByRole('button', { name: /marcar pronto/i }))
    await waitFor(() => {
      expect(advanceOrderStatusAction).toHaveBeenCalledWith('ord-1', 'ready')
    })
  })
})

describe('KitchenCard — badge de tempo', () => {
  test('renderiza badge com tempo decorrido', () => {
    render(<KitchenCard order={base} />)
    // badge deve existir — texto exato depende do horário atual do teste,
    // então verificamos apenas a presença do elemento via role ou data-testid
    expect(screen.getByTestId('elapsed-badge')).toBeInTheDocument()
  })
})
