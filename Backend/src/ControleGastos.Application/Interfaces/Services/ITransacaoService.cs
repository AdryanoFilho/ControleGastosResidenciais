using ControleGastos.Application.DTOs.Transacoes;

namespace ControleGastos.Application.Interfaces.Services;

public interface ITransacaoService
{
    Task<TransacaoResponse> CriarAsync(CriarTransacaoRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TransacaoResponse>> ListarAsync(CancellationToken cancellationToken = default);
}
