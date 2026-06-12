import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DispatchCard } from '@/components/admin/DispatchCard'
import type { Order } from '@/types'

jest.mock('@/app/actions/orders', () => ({
  dispatchDeliveryAction: jest.fn().mockResolvedValue({ ok: true, data: {} }),
  markPickedUpAction:     jest.fn().mockResolvedValue({ ok: true, data: {} }),
  markDeliveredAction:    jest.fn().mockResolvedValue({ ok: true, data: {} }),
}))

function makeOrder(status: Order['status'], fulfillmentType: Order['fulfillment_type']): Order {
  return {
    id: 'o1', user_id: null, status, order_code: 'A001', order_seq: 1,
    customer_name: 'João', customer_phone: '11999990000',
    total: 49.9, freight: 5, fulfillment_type: fulfillmentType, courier_name: null,
    cep: '01310100', street: 'Av. Paulista', street_number: '1000',
    neighborhood: 'Bela Vista', city: 'São Paulo', notes: null,
    created_at: '2026-06-12T12:00:00Z', updated_at: '2026-06-12T12:00:00Z', items: [],
  }
}

describe('DispatchCard — delivery ready', () => {
  const order = makeOrder('ready', 'delivery')

  test('mostra input de nome do motoboy', () => {
    render(<DispatchCard order={order} />)
    expect(screen.getByPlaceholderText(/motoboy|courier/i)).toBeInTheDocument()
  })

  test('mostra botão "Despachar"', () => {
    render(<DispatchCard order={order} />)
    expect(screen.getByRole('button', { name: /despachar/i })).toBeInTheDocument()
  })

  test('NÃO mostra botão de retirada', () => {
    render(<DispatchCard order={order} />)
    expect(screen.queryByRole('button', { name: /retirado/i })).not.toBeInTheDocument()
  })

  test('clique em Despachar chama dispatchDeliveryAction', async () => {
    const { dispatchDeliveryAction } = await import('@/app/actions/orders')
    render(<DispatchCard order={order} />)
    fireEvent.click(screen.getByRole('button', { name: /despachar/i }))
    await waitFor(() => expect(dispatchDeliveryAction).toHaveBeenCalledWith('o1', expect.any(String)))
  })
})

describe('DispatchCard — pickup ready', () => {
  const order = makeOrder('ready', 'pickup')

  test('mostra botão "Marcar como retirado"', () => {
    render(<DispatchCard order={order} />)
    expect(screen.getByRole('button', { name: /retirado/i })).toBeInTheDocument()
  })

  test('NÃO mostra input de motoboy', () => {
    render(<DispatchCard order={order} />)
    expect(screen.queryByPlaceholderText(/motoboy|courier/i)).not.toBeInTheDocument()
  })

  test('NÃO mostra botão Despachar', () => {
    render(<DispatchCard order={order} />)
    expect(screen.queryByRole('button', { name: /despachar/i })).not.toBeInTheDocument()
  })

  test('clique chama markPickedUpAction', async () => {
    const { markPickedUpAction } = await import('@/app/actions/orders')
    render(<DispatchCard order={order} />)
    fireEvent.click(screen.getByRole('button', { name: /retirado/i }))
    await waitFor(() => expect(markPickedUpAction).toHaveBeenCalledWith('o1'))
  })
})

describe('DispatchCard — out_for_delivery', () => {
  const order = makeOrder('out_for_delivery', 'delivery')

  test('mostra botão "Confirmar entrega"', () => {
    render(<DispatchCard order={order} />)
    expect(screen.getByRole('button', { name: /confirmar entrega/i })).toBeInTheDocument()
  })

  test('NÃO mostra botão Despachar', () => {
    render(<DispatchCard order={order} />)
    expect(screen.queryByRole('button', { name: /despachar/i })).not.toBeInTheDocument()
  })

  test('clique chama markDeliveredAction', async () => {
    const { markDeliveredAction } = await import('@/app/actions/orders')
    render(<DispatchCard order={order} />)
    fireEvent.click(screen.getByRole('button', { name: /confirmar entrega/i }))
    await waitFor(() => expect(markDeliveredAction).toHaveBeenCalledWith('o1'))
  })
})
