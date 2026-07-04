using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.DTOs.Transacoes;

/// <summary>Representação de uma transação retornada pela API.</summary>
public sealed record TransacaoResponse(
    int Id,
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    int PessoaId,
    string NomePessoa)
{
    public static TransacaoResponse FromEntity(Transacao transacao) =>
        new(
            transacao.Id,
            transacao.Descricao,
            transacao.Valor,
            transacao.Tipo,
            transacao.PessoaId,
            transacao.Pessoa?.Nome ?? string.Empty);
}
