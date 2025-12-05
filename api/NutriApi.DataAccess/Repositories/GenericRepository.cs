using Microsoft.EntityFrameworkCore;
using NutriApi.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Repositories
{
	public class GenericRepository<T> : IGenericRepository<T> where T : class
	{
		protected readonly NutriDbContext _context;
		protected readonly DbSet<T> _dbSet;

		public GenericRepository(NutriDbContext context)
		{
			_context = context;
			_dbSet = _context.Set<T>();
		}

		public async Task AddAsync(T entity)
		{
			await _dbSet.AddAsync(entity);
		}

		public async Task DeleteByIdAsync(int id)
		{
			var entity = await _dbSet.FindAsync(id);
			if (entity != null)
			{
				_dbSet.Remove(entity);
				await _context.SaveChangesAsync();
			}
		}

		public async Task<T> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

		public async Task<List<T>> GetAllAsync(bool tracked = true)
		{
			var query = tracked ? _dbSet : _dbSet.AsNoTracking();
			return await query.ToListAsync();
		}

		public async Task UpdateAsync(T entity)
		{
			_dbSet.Update(entity);
			await _context.SaveChangesAsync();
		}

		public async Task SaveAsync() => await _context.SaveChangesAsync();
	}
}
