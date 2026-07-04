import { useCallback, useEffect, useRef, useState } from 'react';
import { extrairMensagemDeErro } from '../services/api';

export interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Encapsula o ciclo de vida de uma busca de dados (loading, erro e recarga),
 * ignorando respostas de requisições obsoletas quando um refetch é disparado.
 */
export function useFetch<T>(fetcher: () => Promise<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requisicaoAtual = useRef(0);

  const refetch = useCallback(async () => {
    const requisicao = ++requisicaoAtual.current;
    setIsLoading(true);
    setError(null);

    try {
      const resultado = await fetcher();
      if (requisicao === requisicaoAtual.current) {
        setData(resultado);
      }
    } catch (erro) {
      if (requisicao === requisicaoAtual.current) {
        setError(extrairMensagemDeErro(erro));
      }
    } finally {
      if (requisicao === requisicaoAtual.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
