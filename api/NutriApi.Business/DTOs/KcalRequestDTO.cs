using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.DTOs
{
	public class KcalRequestDto
	{

        public bool Gender { get; set; }
        public double Weight { get; set; }
        public int Height { get; set; }
        public double Activity { get; set; }
        public int Objective { get; set; }
    }
}
