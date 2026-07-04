namespace ControleGastos.Application.DTOs.Pessoas;

/// <summary>Dados necessários para cadastrar uma pessoa.</summary>
/// <param name="Nome">Nome da pessoa.</param>
/// <param name="Idade">Idade em anos completos.</param>
public sealed record CriarPessoaRequest(string? Nome, int? Idade);
