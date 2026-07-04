using ControleGastos.Application.DTOs.Relatorios;
using ControleGastos.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/relatorios")]
[Produces("application/json")]
public sealed class RelatoriosController(IRelatorioService relatorioService) : ControllerBase
{
    /// <summary>Consulta os totais de receitas, despesas e saldo por pessoa, com o total geral consolidado.</summary>
    /// <response code="200">Relatório de totais.</response>
    [HttpGet("totais")]
    [ProducesResponseType(typeof(RelatorioTotaisResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<RelatorioTotaisResponse>> ObterTotais(CancellationToken cancellationToken) =>
        Ok(await relatorioService.ObterTotaisAsync(cancellationToken));
}
