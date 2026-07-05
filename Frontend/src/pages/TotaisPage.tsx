import { Fragment, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { TipoBadge } from '../components/ui/TipoBadge';
import { Spinner } from '../components/feedback/Spinner';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import { useRelatorioTotais } from '../hooks/useRelatorioTotais';
import { formatarMoeda } from '../utils/formatters';

const classeSaldo = (valor: number) => (valor < 0 ? 'negativo' : 'positivo');

export function TotaisPage() {
  const { relatorio, isLoading, error, refetch } = useRelatorioTotais();
  const [expandidos, setExpandidos] = useState<Set<number>>(new Set());

  const alternarDetalhes = (pessoaId: number) => {
    setExpandidos((atuais) => {
      const novos = new Set(atuais);
      if (novos.has(pessoaId)) {
        novos.delete(pessoaId);
      } else {
        novos.add(pessoaId);
      }
      return novos;
    });
  };

  return (
    <>
      <PageHeader
        titulo="Consulta de Totais"
        subtitulo="Receitas, despesas e saldo de cada pessoa. Clique em uma linha para ver as transações."
      />

      <section className="card">
        {isLoading && <Spinner mensagem="Calculando totais..." />}
        {error && <ErrorState mensagem={error} onTentarNovamente={refetch} />}

        {!isLoading && !error && relatorio && relatorio.pessoas.length === 0 && (
          <EmptyState mensagem="Cadastre pessoas e transações para visualizar os totais." />
        )}

        {!isLoading && !error && relatorio && relatorio.pessoas.length > 0 && (
          <div className="tabela-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th className="numero">Total de Receitas</th>
                  <th className="numero">Total de Despesas</th>
                  <th className="numero">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.pessoas.map((pessoa) => {
                  const aberto = expandidos.has(pessoa.pessoaId);
                  return (
                    <Fragment key={pessoa.pessoaId}>
                      <tr
                        className={`linha-expansivel${aberto ? ' linha-expansivel--aberta' : ''}`}
                        onClick={() => alternarDetalhes(pessoa.pessoaId)}
                      >
                        <td>
                          <button
                            type="button"
                            className="expandir"
                            aria-expanded={aberto}
                            aria-label={`${aberto ? 'Ocultar' : 'Ver'} transações de ${pessoa.nome}`}
                            onClick={(evento) => {
                              evento.stopPropagation();
                              alternarDetalhes(pessoa.pessoaId);
                            }}
                          >
                            <svg
                              className={`chevron${aberto ? ' chevron--aberto' : ''}`}
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            {pessoa.nome}
                          </button>
                        </td>
                        <td className="numero positivo">{formatarMoeda(pessoa.totalReceitas)}</td>
                        <td className="numero negativo">{formatarMoeda(pessoa.totalDespesas)}</td>
                        <td className={`numero ${classeSaldo(pessoa.saldo)}`}>
                          {formatarMoeda(pessoa.saldo)}
                        </td>
                      </tr>

                      {aberto && (
                        <tr className="linha-detalhe">
                          <td colSpan={4}>
                            {pessoa.transacoes.length === 0 ? (
                              <p className="detalhe-vazio">
                                Nenhuma transação cadastrada para {pessoa.nome}.
                              </p>
                            ) : (
                              <ul className="lista-transacoes">
                                {pessoa.transacoes.map((transacao) => (
                                  <li key={transacao.id}>
                                    <span className="lista-transacoes__descricao">
                                      {transacao.descricao}
                                    </span>
                                    <TipoBadge tipo={transacao.tipo} />
                                    <span
                                      className={`lista-transacoes__valor numero ${
                                        transacao.tipo === 'Receita' ? 'positivo' : 'negativo'
                                      }`}
                                    >
                                      {formatarMoeda(transacao.valor)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total Geral</td>
                  <td className="numero positivo">
                    {formatarMoeda(relatorio.totaisGerais.totalReceitas)}
                  </td>
                  <td className="numero negativo">
                    {formatarMoeda(relatorio.totaisGerais.totalDespesas)}
                  </td>
                  <td className={`numero ${classeSaldo(relatorio.totaisGerais.saldoLiquido)}`}>
                    {formatarMoeda(relatorio.totaisGerais.saldoLiquido)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
