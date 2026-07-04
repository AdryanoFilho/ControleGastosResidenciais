using ControleGastos.Application.Interfaces.Repositories;
using ControleGastos.Domain.Entities;
using ControleGastos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Infrastructure.Repositories;

public sealed class TransacaoRepository(AppDbContext context) : ITransacaoRepository
{
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
}
