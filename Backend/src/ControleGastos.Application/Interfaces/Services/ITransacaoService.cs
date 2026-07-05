using ControleGastos.Application.DTOs.Transacoes;

namespace ControleGastos.Application.Interfaces.Services;

public interface ITransacaoService
{
    Task<TransacaoResponse> CriarAsync(TransacaoRequest request, CancellationToken cancellationToken = default);
    Task<TransacaoResponse> AtualizarAsync(int id, TransacaoRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TransacaoResponse>> ListarAsync(CancellationToken cancellationToken = default);
    Task ExcluirAsync(int id, CancellationToken cancellationToken = default);
}
