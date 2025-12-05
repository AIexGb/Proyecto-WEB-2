using NutriApi.Business.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.Services
{
	public class CalcCaloricIntakeService : ICalcCaloricIntakeService
	{

		public async Task<CalculoResponseDTO> CalcCaloricIntakeAsync(bool gender, double weight, int height, double activity, int objective)
		{
	}
}
