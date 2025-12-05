using Microsoft.EntityFrameworkCore;
using NutriApi.DataAccess.Interfaces;
using NutriApi.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Repositories
{
	public class PlatilloRepository : GenericRepository<Platillo>, IPlatilloRepository
	{
		public PlatilloRepository(NutriDbContext context) : base(context) { }
		public async Task<Platillo> GetByNameAsync(string name)
		{
			return await _dbSet
				.Where(p => p.Nombre == name)
                .Include(pi => pi.PlatilloIngredientes)
                    .ThenInclude(i => i.Ingrediente)
                .SingleOrDefaultAsync();
		}

		public async Task<List<Platillo>> GetAllWithIngredientesAsync()
		{
			return await _dbSet
				.Include(p => p.PlatilloIngredientes)
					.ThenInclude(pi => pi.Ingrediente)
				.ToListAsync();
		}


	}
}
