import { api } from './api';
import type { CriarTransacaoPayload, Transacao } from '../types/transacao';

export async function listarTransacoes(): Promise<Transacao[]> {
  const { data } = await api.get<Transacao[]>('/transacoes');
  return data;
}

export async function criarTransacao(payload: CriarTransacaoPayload): Promise<Transacao> {
  const { data } = await api.post<Transacao>('/transacoes', payload);
  return data;
}
