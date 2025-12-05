using NutriApi.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.DTOs
{
	public class IngredienteDTO
	{

        public int IngredienteId { get; set; }
        public string Nombre { get; set; }
        public string Tipo { get; set; }
        public double Kcal { get; set; }
        public int proteinaG { get; set; }
        public int grasasG { get; set; }
        public int carbosG { get; set; }
    }
}
