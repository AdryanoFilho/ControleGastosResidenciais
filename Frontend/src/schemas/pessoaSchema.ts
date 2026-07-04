import { z } from 'zod';

export const pessoaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'O nome é obrigatório.')
    .max(100, 'O nome deve possuir no máximo 100 caracteres.'),
  idade: z
    .number({ invalid_type_error: 'A idade é obrigatória.' })
    .int('A idade deve ser um número inteiro.')
    .min(0, 'A idade não pode ser negativa.'),
});

export type PessoaFormData = z.infer<typeof pessoaSchema>;
