namespace ControleGastos.Application.DTOs.Relatorios;

/// <summary>Totais consolidados de uma pessoa.</summary>
public sealed record TotaisPessoaResponse(
    int PessoaId,
    string Nome,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo);

/// <summary>Totais gerais consolidados de todas as pessoas.</summary>
public sealed record TotaisGeraisResponse(
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal SaldoLiquido);

/// <summary>Relatório de totais por pessoa acompanhado do total geral.</summary>
public sealed record RelatorioTotaisResponse(
    IReadOnlyList<TotaisPessoaResponse> Pessoas,
    TotaisGeraisResponse TotaisGerais);
