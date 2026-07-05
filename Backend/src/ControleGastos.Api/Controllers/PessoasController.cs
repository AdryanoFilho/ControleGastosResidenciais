using ControleGastos.Api.Models;
using ControleGastos.Application.DTOs.Pessoas;
using ControleGastos.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/pessoas")]
[Produces("application/json")]
public sealed class PessoasController(IPessoaService pessoaService) : ControllerBase
{
    // summary = cadastra uma pessoa
    // code 201 = pessoa criada
    // code 400 = dados invalidos
    [HttpPost]
    [ProducesResponseType(typeof(PessoaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PessoaResponse>> Criar(PessoaRequest request, CancellationToken cancellationToken)
    {
        var pessoa = await pessoaService.CriarAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, pessoa);
    }

    // summary = lista as pessoas cadastradas
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PessoaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PessoaResponse>>> Listar(CancellationToken cancellationToken) =>
        Ok(await pessoaService.ListarAsync(cancellationToken));

    // summary = atualiza uma pessoa existente
    // remarks = a idade nao pode ser reduzida para menos de 18 anos se a pessoa possuir receitas
    // code 200 = pessoa atualizada
    // code 400 = dados invalidos ou regra violada
    // code 404 = pessoa não encontrada
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PessoaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PessoaResponse>> Atualizar(int id, PessoaRequest request, CancellationToken cancellationToken) =>
        Ok(await pessoaService.AtualizarAsync(id, request, cancellationToken));

    // summary = exclui a pessoa e todas as transacoes dela
    // code 204 = pessoa excluida
    // code 404 = pessoa nao encontrada
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Excluir(int id, CancellationToken cancellationToken)
    {
        await pessoaService.ExcluirAsync(id, cancellationToken);
        return NoContent();
    }
}
