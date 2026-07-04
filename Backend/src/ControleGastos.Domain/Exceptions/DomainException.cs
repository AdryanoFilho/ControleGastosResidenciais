namespace ControleGastos.Domain.Exceptions;

// Regra de negócio violada -> vira 400 no middleware de erros.
public sealed class DomainException : Exception
{
    public DomainException(string message) : base(message)
    {
    }

    public static void Garantir(bool condicao, string mensagem)
    {
        if (!condicao)
        {
            throw new DomainException(mensagem);
        }
    }
}
