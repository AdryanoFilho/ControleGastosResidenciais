using ControleGastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ControleGastos.Infrastructure.Persistence.Configurations;

public sealed class PessoaConfiguration : IEntityTypeConfiguration<Pessoa>
{
    public void Configure(EntityTypeBuilder<Pessoa> builder)
    {
        builder.ToTable("Pessoas");

        builder.HasKey(pessoa => pessoa.Id);

        builder.Property(pessoa => pessoa.Nome)
            .IsRequired()
            .HasMaxLength(Pessoa.NomeTamanhoMaximo);

        builder.Property(pessoa => pessoa.Idade)
            .IsRequired();

        // Exclusão em cascata: ao remover uma pessoa, todas as suas transações são removidas.
        builder.HasMany(pessoa => pessoa.Transacoes)
            .WithOne(transacao => transacao.Pessoa!)
            .HasForeignKey(transacao => transacao.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(pessoa => pessoa.Transacoes)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
