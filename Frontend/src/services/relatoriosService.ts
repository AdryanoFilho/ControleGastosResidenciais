import { api } from './api';
import type { RelatorioTotais } from '../types/relatorio';

export async function obterTotais(): Promise<RelatorioTotais> {
  const { data } = await api.get<RelatorioTotais>('/relatorios/totais');
  return data;
}
