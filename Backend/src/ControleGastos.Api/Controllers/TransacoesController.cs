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
    // summary = cadastra uma transacao (receita ou despesa)
    // remarks = menores de 18 anos so podem cadastrar despesas
    // code 201 = transacao criada
    // code 400 = dados invalidos ou regra de negocio violada
    // code 404 = pessoa nao encontrada
    [HttpPost]
    [ProducesResponseType(typeof(TransacaoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransacaoResponse>> Criar(TransacaoRequest request, CancellationToken cancellationToken)
    {
        var transacao = await transacaoService.CriarAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, transacao);
    }

    // summary = lista as transacoes cadastradas
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TransacaoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TransacaoResponse>>> Listar(CancellationToken cancellationToken) =>
        Ok(await transacaoService.ListarAsync(cancellationToken));

    // summary = atualiza uma transacao existente
    // remarks = menores de 18 anos so podem ter despesas
    // code 200 = transacao atualizada
    // code 400 = dados invalidos ou regra de negocio violada
    // code 404 = transacao ou pessoa nao encontrada
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(TransacaoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransacaoResponse>> Atualizar(int id, TransacaoRequest request, CancellationToken cancellationToken) =>
        Ok(await transacaoService.AtualizarAsync(id, request, cancellationToken));

    // summary = exclui uma transacao
    // code 204 = transacao excluida
    // code 404 =transacao nao encontrada
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Excluir(int id, CancellationToken cancellationToken)
    {
        await transacaoService.ExcluirAsync(id, cancellationToken);
        return NoContent();
    }
}