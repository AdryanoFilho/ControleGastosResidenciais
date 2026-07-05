using ControleGastos.Application.DTOs.Relatorios;
using ControleGastos.Application.Interfaces.Repositories;
using ControleGastos.Application.Interfaces.Services;

namespace ControleGastos.Application.Services;

public sealed class RelatorioService(IPessoaRepository pessoaRepository) : IRelatorioService
{
    public async Task<RelatorioTotaisResponse> ObterTotaisAsync(CancellationToken cancellationToken = default)
    {
        var pessoas = await pessoaRepository.ObterTodasComTransacoesAsync(cancellationToken);

        var totaisPorPessoa = pessoas
            .Select(pessoa => new TotaisPessoaResponse(
                pessoa.Id,
                pessoa.Nome,
                pessoa.TotalReceitas,
                pessoa.TotalDespesas,
                pessoa.Saldo,
                pessoa.Transacoes
                    .OrderByDescending(transacao => transacao.Id)
                    .Select(transacao => new TransacaoResumoResponse(
                        transacao.Id, transacao.Descricao, transacao.Tipo, transacao.Valor))
                    .ToList()))
            .ToList();

        var totaisGerais = new TotaisGeraisResponse(
            TotalReceitas: totaisPorPessoa.Sum(pessoa => pessoa.TotalReceitas),
            TotalDespesas: totaisPorPessoa.Sum(pessoa => pessoa.TotalDespesas),
            SaldoLiquido: totaisPorPessoa.Sum(pessoa => pessoa.Saldo));

        return new RelatorioTotaisResponse(totaisPorPessoa, totaisGerais);
    }
}
