import axios from 'axios';
import type { RespostaDeErro } from '../types/api';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
});

/**
 * Extrai uma mensagem amigável a partir da resposta de erro padronizada da API,
 * com fallback para falhas de rede.
 */
export function extrairMensagemDeErro(error: unknown): string {
  if (axios.isAxiosError<RespostaDeErro>(error)) {
    const dados = error.response?.data;

    if (dados?.erros) {
      return Object.values(dados.erros).flat().join(' ');
    }

    if (dados?.detalhe) {
      return dados.detalhe;
    }

    if (dados?.titulo) {
      return dados.titulo;
    }
  }

  return 'Não foi possível comunicar com o servidor. Verifique se a API está em execução.';
}
