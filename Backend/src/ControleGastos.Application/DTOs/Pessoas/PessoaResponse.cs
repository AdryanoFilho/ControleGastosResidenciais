using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.DTOs.Pessoas;

public sealed record PessoaResponse(int Id, string Nome, int Idade)
{
    public static PessoaResponse FromEntity(Pessoa pessoa) =>
        new(pessoa.Id, pessoa.Nome, pessoa.Idade);
}
