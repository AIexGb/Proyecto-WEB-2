using AutoMapper;
using NutriApi.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.Services
{
	public class ReadServiceAsync<TEntity, TDto> : IReadServiceAsync<TEntity, TDto>
	where TEntity : class
	where TDto : class
	{
	}
}
