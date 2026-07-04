import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '../components/ui/PageHeader';
import { FormField } from '../components/ui/FormField';
import { TipoBadge } from '../components/ui/TipoBadge';
import { Spinner } from '../components/feedback/Spinner';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import { usePessoas } from '../hooks/usePessoas';
import { useTransacoes } from '../hooks/useTransacoes';
import { useToast } from '../hooks/useToast';
import { criarTransacao } from '../services/transacoesService';
import { extrairMensagemDeErro } from '../services/api';
import { transacaoSchema, type TransacaoFormData } from '../schemas/transacaoSchema';
import { formatarMoeda } from '../utils/formatters';

const MAIORIDADE_EM_ANOS = 18;

export function TransacoesPage() {
  const { pessoas, isLoading: carregandoPessoas } = usePessoas();
  const { transacoes, isLoading, error, refetch } = useTransacoes();
  const { mostrarSucesso, mostrarErro } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransacaoFormData>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: { tipo: 'Despesa' },
  });

  const pessoaIdSelecionada = watch('pessoaId');
  const tipoSelecionado = watch('tipo');
  const pessoaSelecionada = pessoas.find((pessoa) => pessoa.id === pessoaIdSelecionada);
  const pessoaEhMenor = pessoaSelecionada !== undefined && pessoaSelecionada.idade < MAIORIDADE_EM_ANOS;

  // Espelha a regra de negócio do backend: menores de idade só cadastram despesas.
  useEffect(() => {
    if (pessoaEhMenor && tipoSelecionado === 'Receita') {
      setValue('tipo', 'Despesa');
    }
  }, [pessoaEhMenor, tipoSelecionado, setValue]);

  const onSubmit = async (dados: TransacaoFormData) => {
    try {
      await criarTransacao(dados);
      mostrarSucesso('Transação cadastrada com sucesso.');
      reset({ tipo: dados.tipo, pessoaId: dados.pessoaId, descricao: '', valor: undefined });
      await refetch();
    } catch (erro) {
      mostrarErro(extrairMensagemDeErro(erro));
    }
  };

  const semPessoas = !carregandoPessoas && pessoas.length === 0;

  return (
    <>
      <PageHeader
        titulo="Transações"
        subtitulo="Registre as receitas e despesas de cada morador."
      />

      <section className="card">
        <h2 className="card__titulo">Nova transação</h2>

        {semPessoas ? (
          <p className="aviso">
            Cadastre uma pessoa antes de registrar transações.{' '}
            <Link to="/pessoas">Ir para o cadastro de pessoas</Link>
          </p>
        ) : (
          <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form__linha">
              <FormField label="Descrição" htmlFor="descricao" error={errors.descricao?.message}>
                <input
                  id="descricao"
                  type="text"
                  placeholder="Ex.: Conta de luz"
                  {...register('descricao')}
                />
              </FormField>

              <FormField label="Valor (R$)" htmlFor="valor" error={errors.valor?.message}>
                <input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Ex.: 150,00"
                  {...register('valor', { valueAsNumber: true })}
                />
              </FormField>
            </div>

            <div className="form__linha">
              <FormField label="Pessoa" htmlFor="pessoaId" error={errors.pessoaId?.message}>
                <select
                  id="pessoaId"
                  defaultValue=""
                  {...register('pessoaId', {
                    setValueAs: (valor) => (valor === '' ? undefined : Number(valor)),
                  })}
                >
                  <option value="" disabled>
                    Selecione uma pessoa
                  </option>
                  {pessoas.map((pessoa) => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} ({pessoa.idade} anos)
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Tipo" htmlFor="tipo-despesa" error={errors.tipo?.message}>
                <div className="segmented" role="radiogroup" aria-label="Tipo da transação">
                  <label className="segmented__opcao">
                    <input id="tipo-despesa" type="radio" value="Despesa" {...register('tipo')} />
                    <span>Despesa</span>
                  </label>
                  <label className="segmented__opcao">
                    <input type="radio" value="Receita" disabled={pessoaEhMenor} {...register('tipo')} />
                    <span>Receita</span>
                  </label>
                </div>
              </FormField>
            </div>

            {pessoaEhMenor && (
              <p className="aviso aviso--regra">
                {pessoaSelecionada?.nome} é menor de idade e pode cadastrar apenas despesas.
              </p>
            )}

            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Cadastrar transação'}
            </button>
          </form>
        )}
      </section>

      <section className="card">
        <h2 className="card__titulo">Transações cadastradas</h2>

        {isLoading && <Spinner mensagem="Carregando transações..." />}
        {error && <ErrorState mensagem={error} onTentarNovamente={refetch} />}

        {!isLoading && !error && transacoes.length === 0 && (
          <EmptyState mensagem="Nenhuma transação cadastrada até o momento." />
        )}

        {!isLoading && !error && transacoes.length > 0 && (
          <div className="tabela-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Pessoa</th>
                  <th>Tipo</th>
                  <th className="numero">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id}>
                    <td>{transacao.descricao}</td>
                    <td>{transacao.nomePessoa}</td>
                    <td>
                      <TipoBadge tipo={transacao.tipo} />
                    </td>
                    <td className={`numero ${transacao.tipo === 'Receita' ? 'positivo' : 'negativo'}`}>
                      {formatarMoeda(transacao.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
