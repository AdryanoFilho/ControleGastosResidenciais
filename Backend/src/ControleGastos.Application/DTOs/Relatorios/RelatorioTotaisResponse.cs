using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.DTOs.Relatorios;

public sealed record TransacaoResumoResponse(int Id, string Descricao, TipoTransacao Tipo, decimal Valor);

public sealed record TotaisPessoaResponse(
    int PessoaId,
    string Nome,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo,
    IReadOnlyList<TransacaoResumoResponse> Transacoes);

public sealed record TotaisGeraisResponse(
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal SaldoLiquido);

public sealed record RelatorioTotaisResponse(
    IReadOnlyList<TotaisPessoaResponse> Pessoas,
    TotaisGeraisResponse TotaisGerais);
