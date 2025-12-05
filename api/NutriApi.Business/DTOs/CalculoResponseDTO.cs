using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.DTOs
{
	public class CalculoResponseDTO
	{
        public double GER { get; set; }
        public double TDEE { get; set; }
        public double TDEE_Ajustado { get; set; }
        public double DailyWater { get; set; }
        public string Mensaje { get; set; }
    }
}
