using NutriApi.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Interfaces
{
	public interface IPlatilloRepository : IGenericRepository<Platillo>
	{
		Task<Platillo> GetByNameAsync(string name);
		Task<List<Platillo>> GetAllWithIngredientesAsync();
	}
}
