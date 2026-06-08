import { z } from 'zod'

export const checkoutSchema = z.object({
  name:         z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  phone:        z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido — ex: (11) 99999-9999'),
  cep:          z.string().regex(/^\d{8}$/, 'CEP inválido — informe 8 dígitos'),
  street:       z.string().min(3, 'Rua obrigatória'),
  number:       z.string().min(1, 'Número obrigatório'),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city:         z.string().min(2, 'Cidade obrigatória'),
  notes:        z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
