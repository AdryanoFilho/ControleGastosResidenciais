/** Formato padronizado de erro retornado pela API. */
export interface RespostaDeErro {
  status: number;
  titulo: string;
  detalhe: string | null;
  erros: Record<string, string[]> | null;
}
