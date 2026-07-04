using System.Text.Json;
using ControleGastos.Api.Models;
using ControleGastos.Application.Exceptions;
using ControleGastos.Domain.Exceptions;
using FluentValidation;

namespace ControleGastos.Api.Middleware;

// Converte qualquer exceção não tratada em uma resposta JSON padronizada (400, 404 ou 500).
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
