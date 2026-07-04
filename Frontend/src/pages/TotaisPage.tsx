import { PageHeader } from '../components/ui/PageHeader';
import { Spinner } from '../components/feedback/Spinner';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import { useRelatorioTotais } from '../hooks/useRelatorioTotais';
import { formatarMoeda } from '../utils/formatters';

const classeSaldo = (valor: number) => (valor < 0 ? 'negativo' : 'positivo');

export function TotaisPage() {
  const { relatorio, isLoading, error, refetch } = useRelatorioTotais();

  return (
    <>
      <PageHeader
        titulo="Consulta de Totais"
        subtitulo="Receitas, despesas e saldo de cada pessoa, com o consolidado geral da residência."
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
                {relatorio.pessoas.map((pessoa) => (
                  <tr key={pessoa.pessoaId}>
                    <td>{pessoa.nome}</td>
                    <td className="numero positivo">{formatarMoeda(pessoa.totalReceitas)}</td>
                    <td className="numero negativo">{formatarMoeda(pessoa.totalDespesas)}</td>
                    <td className={`numero ${classeSaldo(pessoa.saldo)}`}>
                      {formatarMoeda(pessoa.saldo)}
                    </td>
                  </tr>
                ))}
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
