import { z } from 'zod';

export const transacaoSchema = z.object({
  descricao: z
    .string()
    .trim()
    .min(1, 'A descrição é obrigatória.')
    .max(200, 'A descrição deve possuir no máximo 200 caracteres.'),
  valor: z
    .number({ invalid_type_error: 'O valor é obrigatório.' })
    .positive('O valor deve ser maior que zero.'),
  tipo: z.enum(['Despesa', 'Receita'], {
    errorMap: () => ({ message: 'Selecione o tipo da transação.' }),
  }),
  pessoaId: z
    .number({
      required_error: 'Selecione uma pessoa.',
      invalid_type_error: 'Selecione uma pessoa.',
    })
    .int()
    .positive('Selecione uma pessoa.'),
});

export type TransacaoFormData = z.infer<typeof transacaoSchema>;
