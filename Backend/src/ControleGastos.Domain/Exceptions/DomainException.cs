namespace ControleGastos.Domain.Exceptions;

/// <summary>
/// Lançada quando uma regra de negócio do domínio é violada.
/// Convertida em resposta HTTP 400 pelo middleware de tratamento de erros.
/// </summary>
public sealed class DomainException : Exception
{
    public DomainException(string message) : base(message)
    {
    }

    /// <summary>
    /// Garante uma invariante do domínio, lançando <see cref="DomainException"/> quando violada.
    /// </summary>
    public static void Garantir(bool condicao, string mensagem)
    {
        if (!condicao)
        {
            throw new DomainException(mensagem);
        }
    }
}
