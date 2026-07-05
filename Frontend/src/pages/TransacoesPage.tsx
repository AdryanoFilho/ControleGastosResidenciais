import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '../components/ui/PageHeader';
import { FormField } from '../components/ui/FormField';
import { TipoBadge } from '../components/ui/TipoBadge';
import { Spinner } from '../components/feedback/Spinner';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { usePessoas } from '../hooks/usePessoas';
import { useTransacoes } from '../hooks/useTransacoes';
import { useToast } from '../hooks/useToast';
import { criarTransacao, atualizarTransacao, excluirTransacao } from '../services/transacoesService';
import { extrairMensagemDeErro } from '../services/api';
import { transacaoSchema, type TransacaoFormData } from '../schemas/transacaoSchema';
import { formatarMoeda } from '../utils/formatters';
import type { Transacao } from '../types/transacao';

const MAIORIDADE_EM_ANOS = 18;

const FORMULARIO_VAZIO = {
  descricao: '',
  valor: '',
  tipo: 'Despesa',
  pessoaId: '',
} as unknown as TransacaoFormData;

export function TransacoesPage() {
  const { pessoas, isLoading: carregandoPessoas } = usePessoas();
  const { transacoes, isLoading, error, refetch } = useTransacoes();
  const { mostrarSucesso, mostrarErro } = useToast();

  const [emEdicao, setEmEdicao] = useState<Transacao | null>(null);
  const [paraExcluir, setParaExcluir] = useState<Transacao | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const formularioRef = useRef<HTMLElement>(null);

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

  // mesma regra do backend: menor de idade so cadastra despesa
  useEffect(() => {
    if (pessoaEhMenor && tipoSelecionado === 'Receita') {
      setValue('tipo', 'Despesa');
    }
  }, [pessoaEhMenor, tipoSelecionado, setValue]);

  const iniciarEdicao = (transacao: Transacao) => {
    setEmEdicao(transacao);
    reset({
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      pessoaId: transacao.pessoaId,
    });
    formularioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cancelarEdicao = () => {
    setEmEdicao(null);
    reset(FORMULARIO_VAZIO);
  };

  const onSubmit = async (dados: TransacaoFormData) => {
    try {
      if (emEdicao) {
        await atualizarTransacao(emEdicao.id, dados);
        mostrarSucesso('Transação atualizada com sucesso.');
      } else {
        await criarTransacao(dados);
        mostrarSucesso('Transação cadastrada com sucesso.');
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
      await excluirTransacao(paraExcluir.id);
      mostrarSucesso('Transação excluída.');
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

  const semPessoas = !carregandoPessoas && pessoas.length === 0;

  return (
    <>
      <PageHeader
        titulo="Transações"
        subtitulo="Registre, edite e acompanhe as receitas e despesas de cada morador."
      />

      <section className={`card${emEdicao ? ' card--destaque' : ''}`} ref={formularioRef}>
        <h2 className="card__titulo">{emEdicao ? 'Editar transação' : 'Nova transação'}</h2>

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

            <div className="form__acoes">
              <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Salvando...'
                  : emEdicao
                    ? 'Salvar alterações'
                    : 'Cadastrar transação'}
              </button>
              {emEdicao && (
                <button type="button" className="btn btn--secondary" onClick={cancelarEdicao}>
                  Cancelar edição
                </button>
              )}
            </div>
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
                  <th className="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className={emEdicao?.id === transacao.id ? 'linha--editando' : ''}>
                    <td>{transacao.descricao}</td>
                    <td>{transacao.nomePessoa}</td>
                    <td>
                      <TipoBadge tipo={transacao.tipo} />
                    </td>
                    <td className={`numero ${transacao.tipo === 'Receita' ? 'positivo' : 'negativo'}`}>
                      {formatarMoeda(transacao.valor)}
                    </td>
                    <td className="acoes">
                      <div className="acoes__grupo">
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => iniciarEdicao(transacao)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn--danger-outline"
                          onClick={() => setParaExcluir(transacao)}
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
        titulo="Excluir transação"
        mensagem={`Deseja realmente excluir "${paraExcluir?.descricao}" (${formatarMoeda(paraExcluir?.valor ?? 0)})?`}
        processando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setParaExcluir(null)}
      />
    </>
  );
}
