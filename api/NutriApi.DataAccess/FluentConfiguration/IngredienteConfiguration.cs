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
	public class IngredienteConfiguration : IEntityTypeConfiguration<Ingrediente>
	{
		public void Configure(EntityTypeBuilder<Ingrediente> builder)
		{
			builder.ToTable("Ingrediente");

			builder.HasKey(i => i.IngredienteId);

			builder.Property(i => i.IngredienteId)
				.HasColumnName("id")
				.ValueGeneratedOnAdd();

			builder.Property(i => i.Nombre)
				.HasColumnName("nombre")
				.HasMaxLength(30)
				.IsRequired();

			builder.Property(i => i.Tipo)
				.HasColumnName("tipo")
				.HasMaxLength(15);

			builder.Property(i => i.proteinaG)
				.HasColumnName("proteina_g")
				.IsRequired();

			builder.Property(i => i.grasasG)
				.HasColumnName("grasas_g")
				.IsRequired();

			builder.Property(i=>i.carbosG)
				.HasColumnName("carbohidratos_g")
				.IsRequired();
		}
	}
}
