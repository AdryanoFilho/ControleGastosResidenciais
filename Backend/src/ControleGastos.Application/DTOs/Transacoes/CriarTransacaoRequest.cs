using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.DTOs.Transacoes;

/// <summary>Dados necessários para cadastrar uma transação.</summary>
/// <param name="Descricao">Descrição da movimentação.</param>
/// <param name="Valor">Valor positivo da movimentação.</param>
/// <param name="Tipo">Tipo da movimentação: Despesa ou Receita.</param>
/// <param name="PessoaId">Identificador da pessoa responsável.</param>
public sealed record CriarTransacaoRequest(string? Descricao, decimal? Valor, TipoTransacao? Tipo, int? PessoaId);
