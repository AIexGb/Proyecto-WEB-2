using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Models
{
	public class LogActividad
	{
		public LogActividad() { 
			Dispositivo = string.Empty;
			Operacion = string.Empty;
			Fecha = DateTime.Now;
			Tabla = string.Empty;
		}
		public int LogActividadId { get; set; }
		public string Dispositivo { get; set; }
		public string Operacion { get; set; }
		public DateTime Fecha { get; set; }
		public string Tabla { get; set; }
	}
}
