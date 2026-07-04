import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '../components/ui/PageHeader';
import { FormField } from '../components/ui/FormField';
import { Spinner } from '../components/feedback/Spinner';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { usePessoas } from '../hooks/usePessoas';
import { useToast } from '../hooks/useToast';
import { criarPessoa, excluirPessoa } from '../services/pessoasService';
import { extrairMensagemDeErro } from '../services/api';
import { pessoaSchema, type PessoaFormData } from '../schemas/pessoaSchema';
import type { Pessoa } from '../types/pessoa';

export function PessoasPage() {
  const { pessoas, isLoading, error, refetch } = usePessoas();
  const { mostrarSucesso, mostrarErro } = useToast();
  const [pessoaParaExcluir, setPessoaParaExcluir] = useState<Pessoa | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PessoaFormData>({ resolver: zodResolver(pessoaSchema) });

  const onSubmit = async (dados: PessoaFormData) => {
    try {
      await criarPessoa(dados);
      mostrarSucesso('Pessoa cadastrada com sucesso.');
      reset();
      await refetch();
    } catch (erro) {
      mostrarErro(extrairMensagemDeErro(erro));
    }
  };

  const confirmarExclusao = async () => {
    if (!pessoaParaExcluir) return;

    setExcluindo(true);
    try {
      await excluirPessoa(pessoaParaExcluir.id);
      mostrarSucesso('Pessoa e suas transações foram excluídas.');
      setPessoaParaExcluir(null);
      await refetch();
    } catch (erro) {
      mostrarErro(extrairMensagemDeErro(erro));
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <>
      <PageHeader
        titulo="Pessoas"
        subtitulo="Cadastre os moradores responsáveis pelas receitas e despesas da residência."
      />

      <section className="card">
        <h2 className="card__titulo">Nova pessoa</h2>
        <form className="form form--inline" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Nome" htmlFor="nome" error={errors.nome?.message}>
            <input id="nome" type="text" placeholder="Ex.: Maria Silva" {...register('nome')} />
          </FormField>

          <FormField label="Idade" htmlFor="idade" error={errors.idade?.message}>
            <input
              id="idade"
              type="number"
              min={0}
              placeholder="Ex.: 30"
              {...register('idade', { valueAsNumber: true })}
            />
          </FormField>

          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Cadastrar'}
          </button>
        </form>
      </section>

      <section className="card">
        <h2 className="card__titulo">Pessoas cadastradas</h2>

        {isLoading && <Spinner mensagem="Carregando pessoas..." />}
        {error && <ErrorState mensagem={error} onTentarNovamente={refetch} />}

        {!isLoading && !error && pessoas.length === 0 && (
          <EmptyState mensagem="Nenhuma pessoa cadastrada até o momento." />
        )}

        {!isLoading && !error && pessoas.length > 0 && (
          <div className="tabela-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th className="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map((pessoa) => (
                  <tr key={pessoa.id}>
                    <td>
                      {pessoa.nome}
                      {pessoa.idade < 18 && <span className="badge badge--info">Menor de idade</span>}
                    </td>
                    <td>{pessoa.idade} anos</td>
                    <td className="acoes">
                      <button
                        type="button"
                        className="btn btn--danger-outline"
                        onClick={() => setPessoaParaExcluir(pessoa)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        aberto={pessoaParaExcluir !== null}
        titulo="Excluir pessoa"
        mensagem={`Deseja realmente excluir "${pessoaParaExcluir?.nome}"? Todas as transações desta pessoa também serão removidas.`}
        processando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setPessoaParaExcluir(null)}
      />
    </>
  );
}
