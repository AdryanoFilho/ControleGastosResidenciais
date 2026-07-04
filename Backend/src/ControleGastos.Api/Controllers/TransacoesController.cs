using ControleGastos.Api.Models;
using ControleGastos.Application.DTOs.Transacoes;
using ControleGastos.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/transacoes")]
[Produces("application/json")]
public sealed class TransacoesController(ITransacaoService transacaoService) : ControllerBase
{
    /// <summary>Cadastra uma nova transação (receita ou despesa).</summary>
    /// <remarks>Pessoas menores de 18 anos podem cadastrar apenas despesas.</remarks>
    /// <response code="201">Transação cadastrada com sucesso.</response>
    /// <response code="400">Dados inválidos ou regra de negócio violada.</response>
    /// <response code="404">Pessoa informada não existe.</response>
    [HttpPost]
    [ProducesResponseType(typeof(TransacaoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransacaoResponse>> Criar(CriarTransacaoRequest request, CancellationToken cancellationToken)
    {
        var transacao = await transacaoService.CriarAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, transacao);
    }

    /// <summary>Lista todas as transações cadastradas.</summary>
    /// <response code="200">Lista de transações.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TransacaoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TransacaoResponse>>> Listar(CancellationToken cancellationToken) =>
        Ok(await transacaoService.ListarAsync(cancellationToken));
}
