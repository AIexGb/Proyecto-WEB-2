using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.Services
{
	public interface IGenericServiceAsync<TEntity, TDto> : IReadServiceAsync<TEntity, TDto>
	where TEntity : class
	where TDto : class
	{
        Task AddAsync(TDto dto);
        Task DeleteByIdAsync(int id);
        Task UpdateAsync(TDto dto);
    }
}
