using ControleGastos.Application.Interfaces.Repositories;
using ControleGastos.Domain.Entities;
using ControleGastos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Infrastructure.Repositories;

public sealed class PessoaRepository(AppDbContext context) : IPessoaRepository
{
    public Task<Pessoa?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default) =>
        context.Pessoas.FirstOrDefaultAsync(pessoa => pessoa.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Pessoa>> ObterTodasAsync(CancellationToken cancellationToken = default) =>
        await context.Pessoas
            .AsNoTracking()
            .OrderBy(pessoa => pessoa.Nome)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Pessoa>> ObterTodasComTransacoesAsync(CancellationToken cancellationToken = default) =>
        await context.Pessoas
            .AsNoTracking()
            .Include(pessoa => pessoa.Transacoes)
            .OrderBy(pessoa => pessoa.Nome)
            .ToListAsync(cancellationToken);

    public async Task AdicionarAsync(Pessoa pessoa, CancellationToken cancellationToken = default)
    {
        context.Pessoas.Add(pessoa);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoverAsync(Pessoa pessoa, CancellationToken cancellationToken = default)
    {
        context.Pessoas.Remove(pessoa);
        await context.SaveChangesAsync(cancellationToken);
    }
}
