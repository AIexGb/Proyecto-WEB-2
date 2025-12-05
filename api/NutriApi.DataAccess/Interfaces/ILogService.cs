using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Interfaces
{
	public interface ILogService
	{
		Task AddLogAsync(string dispositivo, string operacion, string tabla);
	}
}
