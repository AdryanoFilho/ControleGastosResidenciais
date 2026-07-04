import { listarPessoas } from '../services/pessoasService';
import { useFetch } from './useFetch';

export function usePessoas() {
  const { data, isLoading, error, refetch } = useFetch(listarPessoas);
  return { pessoas: data ?? [], isLoading, error, refetch };
}
