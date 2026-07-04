using ControleGastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ControleGastos.Infrastructure.Persistence.Configurations;

public sealed class TransacaoConfiguration : IEntityTypeConfiguration<Transacao>
{
    public void Configure(EntityTypeBuilder<Transacao> builder)
    {
        builder.ToTable("Transacoes");

        builder.HasKey(transacao => transacao.Id);

        builder.Property(transacao => transacao.Descricao)
            .IsRequired()
            .HasMaxLength(Transacao.DescricaoTamanhoMaximo);

        builder.Property(transacao => transacao.Valor)
            .IsRequired()
            .HasPrecision(18, 2);

        // Armazenado como texto ("Despesa"/"Receita") para manter o banco legível.
        builder.Property(transacao => transacao.Tipo)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);
    }
}
