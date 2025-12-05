using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Models
{
	public class PlatilloIngrediente
	{
		public int PlatilloIngredienteId { get; set; }
		public int PlatilloId { get; set; }
		public Platillo Platillo { get; set; }

		public int IngredienteId { get; set; }
		public Ingrediente Ingrediente { get; set; }

		public double Cantidad { get; set; }
	}
}
