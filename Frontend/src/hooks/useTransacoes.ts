import { listarTransacoes } from '../services/transacoesService';
import { useFetch } from './useFetch';

export function useTransacoes() {
  const { data, isLoading, error, refetch } = useFetch(listarTransacoes);
  return { transacoes: data ?? [], isLoading, error, refetch };
}
