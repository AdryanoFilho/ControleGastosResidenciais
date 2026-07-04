namespace ControleGastos.Application.DTOs.Relatorios;

public sealed record TotaisPessoaResponse(
    int PessoaId,
    string Nome,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo);

public sealed record TotaisGeraisResponse(
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal SaldoLiquido);

public sealed record RelatorioTotaisResponse(
    IReadOnlyList<TotaisPessoaResponse> Pessoas,
    TotaisGeraisResponse TotaisGerais);
