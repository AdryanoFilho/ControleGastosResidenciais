using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces.Repositories;

public interface IPessoaRepository
{
    Task<Pessoa?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Pessoa>> ObterTodasAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Pessoa>> ObterTodasComTransacoesAsync(CancellationToken cancellationToken = default);
    Task AdicionarAsync(Pessoa pessoa, CancellationToken cancellationToken = default);
    Task RemoverAsync(Pessoa pessoa, CancellationToken cancellationToken = default);
}
