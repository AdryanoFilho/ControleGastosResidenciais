using ControleGastos.Application.DTOs.Relatorios;

namespace ControleGastos.Application.Interfaces.Services;

public interface IRelatorioService
{
    Task<RelatorioTotaisResponse> ObterTotaisAsync(CancellationToken cancellationToken = default);
}
