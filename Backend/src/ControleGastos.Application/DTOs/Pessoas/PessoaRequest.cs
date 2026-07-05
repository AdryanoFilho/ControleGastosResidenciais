namespace ControleGastos.Application.DTOs.Pessoas;

// usado tanto no cadastro quanto na atualizacao
public sealed record PessoaRequest(string? Nome, int? Idade);
