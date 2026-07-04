export type TipoTransacao = 'Despesa' | 'Receita';

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
  nomePessoa: string;
}

export interface CriarTransacaoPayload {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
}
