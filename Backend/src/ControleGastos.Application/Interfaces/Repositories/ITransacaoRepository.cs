using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces.Repositories;

public interface ITransacaoRepository
{
    Task<IReadOnlyList<Transacao>> ObterTodasAsync(CancellationToken cancellationToken = default);
    Task AdicionarAsync(Transacao transacao, CancellationToken cancellationToken = default);
}
