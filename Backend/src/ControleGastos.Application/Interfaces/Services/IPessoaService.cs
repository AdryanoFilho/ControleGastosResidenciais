using ControleGastos.Application.DTOs.Pessoas;

namespace ControleGastos.Application.Interfaces.Services;

public interface IPessoaService
{
    Task<PessoaResponse> CriarAsync(PessoaRequest request, CancellationToken cancellationToken = default);
    Task<PessoaResponse> AtualizarAsync(int id, PessoaRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PessoaResponse>> ListarAsync(CancellationToken cancellationToken = default);
    Task ExcluirAsync(int id, CancellationToken cancellationToken = default);
}
