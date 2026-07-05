import type { TipoTransacao } from './transacao';

export interface TransacaoResumo {
  id: number;
  descricao: string;
  tipo: TipoTransacao;
  valor: number;
}

export interface TotaisPessoa {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  transacoes: TransacaoResumo[];
}

export interface TotaisGerais {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface RelatorioTotais {
  pessoas: TotaisPessoa[];
  totaisGerais: TotaisGerais;
}
