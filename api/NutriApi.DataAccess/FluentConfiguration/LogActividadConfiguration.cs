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
	public class LogActividadConfiguration : IEntityTypeConfiguration<LogActividad>
	{
		public void Configure(EntityTypeBuilder<LogActividad> builder)
		{
			builder.ToTable("LogActividad");

			builder.HasKey(l => l.LogActividadId);

			builder.Property(l => l.LogActividadId)
				.HasColumnName("id")
				.ValueGeneratedOnAdd();

			builder.Property(l => l.Dispositivo)
				.HasColumnName("dispositivo")
				.HasMaxLength(30);

			builder.Property(l => l.Operacion)
				.HasColumnName("operacion")
				.HasMaxLength(80);

			builder.Property(l => l.Fecha)
				.HasColumnName("fecha_hora")
				.HasColumnType("datetime");

			builder.Property(l => l.Tabla)
				.HasColumnName("tabla_afectada")
				.HasMaxLength(30);
		}
	}
}
