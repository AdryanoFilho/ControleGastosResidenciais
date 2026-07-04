using System.Text.Json;
using ControleGastos.Application.Exceptions;
using ControleGastos.Domain.Exceptions;
using FluentValidation;

namespace ControleGastos.Api.Middleware;

/// <summary>
/// Captura qualquer exceção não tratada e a converte em uma resposta JSON padronizada:
/// 400 para erros de validação e regras de negócio, 404 para recursos inexistentes e 500 para falhas inesperadas.
/// </summary>
public sealed class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            await TratarExcecaoAsync(context, exception);
        }
    }

    private async Task TratarExcecaoAsync(HttpContext context, Exception exception)
    {
        var resposta = exception switch
        {
            ValidationException validationException => RespostaDeErro.Validacao(
                validationException.Errors
                    .GroupBy(erro => JsonNamingPolicy.CamelCase.ConvertName(erro.PropertyName))
                    .ToDictionary(grupo => grupo.Key, grupo => grupo.Select(erro => erro.ErrorMessage).ToArray())),

            DomainException domainException => RespostaDeErro.RegraDeNegocio(domainException.Message),

            NotFoundException notFoundException => RespostaDeErro.NaoEncontrado(notFoundException.Message),

            _ => RespostaDeErro.Interno()
        };

        if (resposta.Status == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Erro não tratado ao processar {Metodo} {Rota}",
                context.Request.Method, context.Request.Path);
        }

        context.Response.StatusCode = resposta.Status;
        context.Response.ContentType = "application/json; charset=utf-8";
        await context.Response.WriteAsync(JsonSerializer.Serialize(resposta, SerializerOptions));
    }
}

/// <summary>Formato padronizado de erro retornado pela API.</summary>
public sealed record RespostaDeErro(int Status, string Titulo, string? Detalhe, IDictionary<string, string[]>? Erros)
{
    public static RespostaDeErro Validacao(IDictionary<string, string[]> erros) =>
        new(StatusCodes.Status400BadRequest, "Erro de validação.", null, erros);

    public static RespostaDeErro RegraDeNegocio(string detalhe) =>
        new(StatusCodes.Status400BadRequest, "Regra de negócio violada.", detalhe, null);

    public static RespostaDeErro NaoEncontrado(string detalhe) =>
        new(StatusCodes.Status404NotFound, "Recurso não encontrado.", detalhe, null);

    public static RespostaDeErro Interno() =>
        new(StatusCodes.Status500InternalServerError, "Erro interno do servidor.",
            "Ocorreu um erro inesperado. Tente novamente mais tarde.", null);
}
