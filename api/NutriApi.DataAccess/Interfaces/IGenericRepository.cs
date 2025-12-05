using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Interfaces
{
	public interface IGenericRepository<T> where T : class
	{
		Task AddAsync(T entity);
		Task<T> GetByIdAsync(int id);
		Task<List<T?>> GetAllAsync(bool tracked = true);
		Task UpdateAsync(T entity);
		Task DeleteByIdAsync(int id);
		Task SaveAsync();
	}
}
