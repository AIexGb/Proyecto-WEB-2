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
		
	}
}
