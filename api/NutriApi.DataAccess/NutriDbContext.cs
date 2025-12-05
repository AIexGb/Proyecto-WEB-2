// DATA ACCESS DB CONTEXT

using Microsoft.EntityFrameworkCore;
using NutriApi.DataAccess.Models;
using NutriApi.DataAccess.FluentConfiguration;
using System.Collections.Generic;
using System.Reflection.Emit;

public class NutriDbContext : DbContext
{
	public NutriDbContext(DbContextOptions<NutriDbContext> options) : base(options) { }

	public DbSet<Ingrediente> Ingredientes { get; set; }
	public DbSet<Platillo> Platillos { get; set; }
	public DbSet<PlatilloIngrediente> PlatilloIngredientes { get; set; }
	public DbSet<LogActividad> Logs { get; set; }
	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.ApplyConfiguration(new IngredienteConfiguration());
		modelBuilder.ApplyConfiguration(new PlatilloConfiguration());
		modelBuilder.ApplyConfiguration(new PlatilloIngredienteConfiguration());
		modelBuilder.ApplyConfiguration(new LogActividadConfiguration());
	}
}