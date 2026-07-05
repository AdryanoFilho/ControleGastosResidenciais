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
    /// <summary>Cadastra uma transação (receita ou despesa).</summary>
    /// <remarks>Menores de 18 anos só podem cadastrar despesas.</remarks>
    /// <response code="201">Transação criada.</response>
    /// <response code="400">Dados inválidos ou regra de negócio violada.</response>
    /// <response code="404">Pessoa não encontrada.</response>
    [HttpPost]
    [ProducesResponseType(typeof(TransacaoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransacaoResponse>> Criar(TransacaoRequest request, CancellationToken cancellationToken)
    {
        var transacao = await transacaoService.CriarAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, transacao);
    }

    /// <summary>Lista as transações cadastradas.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TransacaoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TransacaoResponse>>> Listar(CancellationToken cancellationToken) =>
        Ok(await transacaoService.ListarAsync(cancellationToken));

    /// <summary>Atualiza uma transação existente.</summary>
    /// <remarks>Menores de 18 anos só podem ter despesas.</remarks>
    /// <response code="200">Transação atualizada.</response>
    /// <response code="400">Dados inválidos ou regra de negócio violada.</response>
    /// <response code="404">Transação ou pessoa não encontrada.</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(TransacaoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransacaoResponse>> Atualizar(int id, TransacaoRequest request, CancellationToken cancellationToken) =>
        Ok(await transacaoService.AtualizarAsync(id, request, cancellationToken));

    /// <summary>Exclui uma transação.</summary>
    /// <response code="204">Transação excluída.</response>
    /// <response code="404">Transação não encontrada.</response>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Excluir(int id, CancellationToken cancellationToken)
    {
        await transacaoService.ExcluirAsync(id, cancellationToken);
        return NoContent();
    }
}
