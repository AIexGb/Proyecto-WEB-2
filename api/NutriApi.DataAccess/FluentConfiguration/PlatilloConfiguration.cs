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
	public class PlatilloConfiguration : IEntityTypeConfiguration<Platillo>
	{
		public void Configure(EntityTypeBuilder<Platillo> builder)
		{
			builder.ToTable("Platillo");

			builder.HasKey(p => p.PlatilloId);

			builder.Property(p => p.PlatilloId)
				.HasColumnName("id")
				.ValueGeneratedOnAdd();

			builder.Property(p => p.Nombre)
				.HasColumnName("nombre")
				.HasMaxLength(80)
				.IsRequired();

			builder.Property(p => p.Fecha)
				.HasColumnName("fecha_creacion")
				.HasColumnType("datetimeoffset");

			builder.Property(p => p.KcalTotal)
				.HasColumnName("kcal")
				.IsRequired();
		}
	}
}
