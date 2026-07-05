using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces.Repositories;

public interface ITransacaoRepository
{
    Task<Transacao?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Transacao>> ObterTodasAsync(CancellationToken cancellationToken = default);
    Task AdicionarAsync(Transacao transacao, CancellationToken cancellationToken = default);
    Task SalvarAlteracoesAsync(CancellationToken cancellationToken = default);
    Task RemoverAsync(Transacao transacao, CancellationToken cancellationToken = default);
}
