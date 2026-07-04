// formato de erro que a API devolve
export interface RespostaDeErro {
  status: number;
  titulo: string;
  detalhe: string | null;
  erros: Record<string, string[]> | null;
}
