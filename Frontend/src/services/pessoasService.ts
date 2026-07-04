import { api } from './api';
import type { CriarPessoaPayload, Pessoa } from '../types/pessoa';

export async function listarPessoas(): Promise<Pessoa[]> {
  const { data } = await api.get<Pessoa[]>('/pessoas');
  return data;
}

export async function criarPessoa(payload: CriarPessoaPayload): Promise<Pessoa> {
  const { data } = await api.post<Pessoa>('/pessoas', payload);
  return data;
}

export async function excluirPessoa(id: number): Promise<void> {
  await api.delete(`/pessoas/${id}`);
}
