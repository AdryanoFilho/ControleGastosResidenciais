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

const propsIcone = {
  viewBox: '0 0 24 24',
  width: 20,
  height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const icones = {
  pessoas: (
    <svg {...propsIcone}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  receitas: (
    <svg {...propsIcone}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  despesas: (
    <svg {...propsIcone}>
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  ),
  saldo: (
    <svg {...propsIcone}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
};

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
            <SummaryCard
              titulo="Pessoas cadastradas"
              valor={String(relatorio.pessoas.length)}
              icone={icones.pessoas}
            />
            <SummaryCard
              titulo="Total de Receitas"
              valor={formatarMoeda(relatorio.totaisGerais.totalReceitas)}
              variante="positivo"
              icone={icones.receitas}
            />
            <SummaryCard
              titulo="Total de Despesas"
              valor={formatarMoeda(relatorio.totaisGerais.totalDespesas)}
              variante="negativo"
              icone={icones.despesas}
            />
            <SummaryCard
              titulo="Saldo Líquido"
              valor={formatarMoeda(relatorio.totaisGerais.saldoLiquido)}
              variante={relatorio.totaisGerais.saldoLiquido < 0 ? 'negativo' : 'positivo'}
              icone={icones.saldo}
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
