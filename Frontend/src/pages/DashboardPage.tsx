import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { SummaryCard } from '../components/ui/SummaryCard';
import { TipoBadge } from '../components/ui/TipoBadge';
import { Spinner } from '../components/feedback/Spinner';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import { useRelatorioTotais } from '../hooks/useRelatorioTotais';
import { useTransacoes } from '../hooks/useTransacoes';
import { formatarMoeda } from '../utils/formatters';

const QUANTIDADE_TRANSACOES_RECENTES = 5;

export function DashboardPage() {
  const { relatorio, isLoading: carregandoTotais, error: erroTotais, refetch } = useRelatorioTotais();
  const { transacoes, isLoading: carregandoTransacoes } = useTransacoes();

  const carregando = carregandoTotais || carregandoTransacoes;
  const transacoesRecentes = transacoes.slice(0, QUANTIDADE_TRANSACOES_RECENTES);

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        subtitulo="Visão geral das finanças da residência."
      />

      {carregando && <Spinner mensagem="Carregando visão geral..." />}
      {erroTotais && <ErrorState mensagem={erroTotais} onTentarNovamente={refetch} />}

      {!carregando && !erroTotais && relatorio && (
        <>
          <div className="summary-grid">
            <SummaryCard titulo="Pessoas cadastradas" valor={String(relatorio.pessoas.length)} />
            <SummaryCard
              titulo="Total de Receitas"
              valor={formatarMoeda(relatorio.totaisGerais.totalReceitas)}
              variante="positivo"
            />
            <SummaryCard
              titulo="Total de Despesas"
              valor={formatarMoeda(relatorio.totaisGerais.totalDespesas)}
              variante="negativo"
            />
            <SummaryCard
              titulo="Saldo Líquido"
              valor={formatarMoeda(relatorio.totaisGerais.saldoLiquido)}
              variante={relatorio.totaisGerais.saldoLiquido < 0 ? 'negativo' : 'positivo'}
            />
          </div>

          <section className="card">
            <div className="card__cabecalho">
              <h2 className="card__titulo">Transações recentes</h2>
              <Link className="link" to="/transacoes">
                Ver todas
              </Link>
            </div>

            {transacoesRecentes.length === 0 ? (
              <EmptyState mensagem="Nenhuma transação registrada. Comece cadastrando pessoas e transações." />
            ) : (
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
                    {transacoesRecentes.map((transacao) => (
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
      )}
    </>
  );
}
