using ControleGastos.Application.Interfaces.Services;
using ControleGastos.Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace ControleGastos.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IPessoaService, PessoaService>();
        services.AddScoped<ITransacaoService, TransacaoService>();
        services.AddScoped<IRelatorioService, RelatorioService>();

        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        return services;
    }
}
