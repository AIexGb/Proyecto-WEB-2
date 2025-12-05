using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NutriApi.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.FluentConfiguration
{
	public class PlatilloIngredienteConfiguration : IEntityTypeConfiguration<PlatilloIngrediente>
	{
		public void Configure(EntityTypeBuilder<PlatilloIngrediente> builder)
		{
			builder.ToTable("PlatilloIngrediente");

			builder.HasKey(pi => pi.PlatilloIngredienteId);

			builder.Property(pi => pi.PlatilloIngredienteId)
				.HasColumnName("id")
				.ValueGeneratedOnAdd();

			builder.Property(pi => pi.PlatilloId)
				.HasColumnName("id_platillo");

			builder.Property(pi => pi.IngredienteId)
				.HasColumnName("id_ingrediente");

			builder.Property(pi => pi.Cantidad)
				.HasColumnName("cantidad")
				.HasColumnType("float");

			builder.HasOne(pi => pi.Platillo)
				.WithMany(p => p.PlatilloIngredientes)
				.HasForeignKey(pi => pi.PlatilloId);
		}
	}
}
