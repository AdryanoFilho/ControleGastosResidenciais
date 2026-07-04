import { obterTotais } from '../services/relatoriosService';
import { useFetch } from './useFetch';

export function useRelatorioTotais() {
  const { data, isLoading, error, refetch } = useFetch(obterTotais);
  return { relatorio: data, isLoading, error, refetch };
}
