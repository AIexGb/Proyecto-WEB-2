using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.DataAccess.Models
{
	public class Ingrediente
	{
		public Ingrediente()
		{
			Nombre = string.Empty;
			Tipo = string.Empty;
		}
		public int IngredienteId { get; set; }
		public string Nombre { get; set; }
		public string Tipo { get; set; }
		public int proteinaG { get; set; }
		public int grasasG { get; set; }
		public int carbosG { get; set; }

	}
}
