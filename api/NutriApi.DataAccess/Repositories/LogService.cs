using NutriApi.DataAccess.Interfaces;
using NutriApi.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Repositories
{
	public class LogService : ILogService
	{
		private readonly NutriDbContext _context;
		public LogService(NutriDbContext context)
		{
			_context = context;
		}

		public async Task AddLogAsync(string dispositivo, string operacion, string tabla)
		{
			var log = new LogActividad
			{
				Dispositivo = dispositivo,
				Operacion = operacion,
				Tabla = tabla,
				Fecha = DateTime.Now
			};

			await _context.Logs.AddAsync(log);
			await _context.SaveChangesAsync();
		}
	}
}
