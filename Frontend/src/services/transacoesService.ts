import { api } from './api';
import type { Transacao, TransacaoPayload } from '../types/transacao';

export async function listarTransacoes(): Promise<Transacao[]> {
  const { data } = await api.get<Transacao[]>('/transacoes');
  return data;
}

export async function criarTransacao(payload: TransacaoPayload): Promise<Transacao> {
  const { data } = await api.post<Transacao>('/transacoes', payload);
  return data;
}

export async function atualizarTransacao(id: number, payload: TransacaoPayload): Promise<Transacao> {
  const { data } = await api.put<Transacao>(`/transacoes/${id}`, payload);
  return data;
}

export async function excluirTransacao(id: number): Promise<void> {
  await api.delete(`/transacoes/${id}`);
}
