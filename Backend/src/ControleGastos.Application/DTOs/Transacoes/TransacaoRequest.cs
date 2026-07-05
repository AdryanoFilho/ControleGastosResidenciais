using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.DTOs.Transacoes;

// usado tanto no cadastro quanto na atualização
public sealed record TransacaoRequest(string? Descricao, decimal? Valor, TipoTransacao? Tipo, int? PessoaId);
