import { z } from 'zod'

const newOrderItemFlavorSchema = z.object({
  name:  z.string().min(1),
  price: z.number().nonnegative(),
  type:  z.string().nullable(),
})

const newOrderItemSchema = z.object({
  format_code:  z.string().min(1),
  format_label: z.string().min(1),
  flavors:      z.array(newOrderItemFlavorSchema).min(1),
  unit_price:   z.number().positive(),
  quantity:     z.number().int().positive(),
})

export const newOrderSchema = z.object({
  customer_name:    z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  customer_phone:   z.string().min(10, 'Telefone inválido').max(15),
  cep:              z.string().length(8, 'CEP deve ter 8 dígitos'),
  street:           z.string().min(2, 'Rua obrigatória'),
  street_number:    z.string().min(1, 'Número obrigatório'),
  neighborhood:     z.string().min(2, 'Bairro obrigatório'),
  city:             z.string().min(2, 'Cidade obrigatória'),
  notes:            z.string().nullable().optional(),
  total:            z.number().positive('Total deve ser positivo'),
  freight:          z.number().nonnegative().nullable(),
  fulfillment_type: z.enum(['delivery', 'pickup']),
  items:            z.array(newOrderItemSchema).min(1, 'Pedido deve ter ao menos um item'),
})

export type NewOrderSchemaInput = z.infer<typeof newOrderSchema>
