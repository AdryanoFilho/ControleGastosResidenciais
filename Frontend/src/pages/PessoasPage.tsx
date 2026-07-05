import { useRef, useState } from 'react';
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
import { criarPessoa, atualizarPessoa, excluirPessoa } from '../services/pessoasService';
import { extrairMensagemDeErro } from '../services/api';
import { pessoaSchema, type PessoaFormData } from '../schemas/pessoaSchema';
import type { Pessoa } from '../types/pessoa';

const FORMULARIO_VAZIO = { nome: '', idade: '' } as unknown as PessoaFormData;

export function PessoasPage() {
  const { pessoas, isLoading, error, refetch } = usePessoas();
  const { mostrarSucesso, mostrarErro } = useToast();

  const [emEdicao, setEmEdicao] = useState<Pessoa | null>(null);
  const [paraExcluir, setParaExcluir] = useState<Pessoa | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const formularioRef = useRef<HTMLElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PessoaFormData>({ resolver: zodResolver(pessoaSchema) });

  const iniciarEdicao = (pessoa: Pessoa) => {
    setEmEdicao(pessoa);
    reset({ nome: pessoa.nome, idade: pessoa.idade });
    formularioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cancelarEdicao = () => {
    setEmEdicao(null);
    reset(FORMULARIO_VAZIO);
  };

  const onSubmit = async (dados: PessoaFormData) => {
    try {
      if (emEdicao) {
        await atualizarPessoa(emEdicao.id, dados);
        mostrarSucesso('Pessoa atualizada com sucesso.');
      } else {
        await criarPessoa(dados);
        mostrarSucesso('Pessoa cadastrada com sucesso.');
      }
      cancelarEdicao();
      await refetch();
    } catch (erro) {
      mostrarErro(extrairMensagemDeErro(erro));
    }
  };

  const confirmarExclusao = async () => {
    if (!paraExcluir) return;

    setExcluindo(true);
    try {
      await excluirPessoa(paraExcluir.id);
      mostrarSucesso('Pessoa e suas transações foram excluídas.');
      if (emEdicao?.id === paraExcluir.id) {
        cancelarEdicao();
      }
      setParaExcluir(null);
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
        subtitulo="Cadastre e mantenha os moradores responsáveis pelas receitas e despesas da residência."
      />

      <section className={`card${emEdicao ? ' card--destaque' : ''}`} ref={formularioRef}>
        <h2 className="card__titulo">{emEdicao ? 'Editar pessoa' : 'Nova pessoa'}</h2>
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

          <div className="form__acoes">
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : emEdicao ? 'Salvar alterações' : 'Cadastrar'}
            </button>
            {emEdicao && (
              <button type="button" className="btn btn--secondary" onClick={cancelarEdicao}>
                Cancelar edição
              </button>
            )}
          </div>
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
                  <tr key={pessoa.id} className={emEdicao?.id === pessoa.id ? 'linha--editando' : ''}>
                    <td>
                      {pessoa.nome}
                      {pessoa.idade < 18 && <span className="badge badge--info">Menor de idade</span>}
                    </td>
                    <td>{pessoa.idade} anos</td>
                    <td className="acoes">
                      <div className="acoes__grupo">
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => iniciarEdicao(pessoa)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn--danger-outline"
                          onClick={() => setParaExcluir(pessoa)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        aberto={paraExcluir !== null}
        titulo="Excluir pessoa"
        mensagem={`Deseja realmente excluir "${paraExcluir?.nome}"? Todas as transações desta pessoa também serão removidas.`}
        processando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setParaExcluir(null)}
      />
    </>
  );
}
