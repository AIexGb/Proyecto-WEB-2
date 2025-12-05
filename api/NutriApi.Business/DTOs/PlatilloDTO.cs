using NutriApi.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.DTOs
{
	public class PlatilloDTO
	{

        public int PlatilloId { get; set; }
        public string Nombre { get; set; }
        public DateTimeOffset Fecha { get; set; }
        public double KCalTotal { get; set; }

        public List<String> PlatilloIngredientes { get; set; }
    }
}
