using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.DTOs.Transacoes;

public sealed record CriarTransacaoRequest(string? Descricao, decimal? Valor, TipoTransacao? Tipo, int? PessoaId);
