using ControleGastos.Application.Interfaces.Repositories;
using ControleGastos.Domain.Entities;
using ControleGastos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Infrastructure.Repositories;

public sealed class TransacaoRepository(AppDbContext context) : ITransacaoRepository
{
    public Task<Transacao?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default) =>
        context.Transacoes
            .Include(transacao => transacao.Pessoa)
            .FirstOrDefaultAsync(transacao => transacao.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Transacao>> ObterTodasAsync(CancellationToken cancellationToken = default) =>
        await context.Transacoes
            .AsNoTracking()
            .Include(transacao => transacao.Pessoa)
            .OrderByDescending(transacao => transacao.Id)
            .ToListAsync(cancellationToken);

    public async Task AdicionarAsync(Transacao transacao, CancellationToken cancellationToken = default)
    {
        context.Transacoes.Add(transacao);
        await context.SaveChangesAsync(cancellationToken);
    }

    public Task SalvarAlteracoesAsync(CancellationToken cancellationToken = default) =>
        context.SaveChangesAsync(cancellationToken);

    public async Task RemoverAsync(Transacao transacao, CancellationToken cancellationToken = default)
    {
        context.Transacoes.Remove(transacao);
        await context.SaveChangesAsync(cancellationToken);
    }
}
