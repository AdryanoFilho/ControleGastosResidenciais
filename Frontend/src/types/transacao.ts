export type TipoTransacao = 'Despesa' | 'Receita';

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
  nomePessoa: string;
}

export interface TransacaoPayload {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
}
