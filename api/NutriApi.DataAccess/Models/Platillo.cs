using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Models
{
	public class Platillo
	{
		public Platillo() { 
			Nombre = string.Empty;
			Fecha = DateTimeOffset.Now;
			KcalTotal = 0;
		}
		public int PlatilloId { get; set; }
		public string Nombre { get; set; }
		public DateTimeOffset Fecha { get; set; }
		public int KcalTotal { get; set; }

		public ICollection<PlatilloIngrediente> PlatilloIngredientes { get; set; }
	}
}
