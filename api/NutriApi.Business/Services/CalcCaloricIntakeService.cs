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
            //use this comment to define the objectives (1 = downwheight, 2 = mantain, 3 = upweight)
            //use this comment to define the gender variable (true = hombre, false = mujer)

            double heightIN = height / 2.54;
            double PI;      //stands for "Peso Ideal"
            double PA;      //stands for "Peso Ajustado"
            double GER;     //stands for "Gasto Energetico en Reposo"
            double TDEE;    //stands for "Total Daily Energy Expenditure" o "Gasto total energetico diario"
            double ajuste = 0;
            double waterConsumption = 0;

            if (gender)
            {
                PI = 50 + 2.3 * (heightIN - 60);
            }
            else
            {
                PI = 45.5 + 2.3 * (heightIN - 60);
            }

            PA = (weight - PI) * 0.25 + PI;

            GER = 25 * PA;

            TDEE = GER * activity;

            if (objective == 1)//downwheight
            {
                ajuste = -300;
            }
            if (objective == 2)//mantain
            {
                ajuste = 0;
            }
            if (objective == 3)//upweight
            {
                ajuste = 300;
            }

            waterConsumption = weight * 0.035;

            return new CalculoResponseDTO
            {
                GER = Math.Round(GER, 2),
                TDEE = Math.Round(TDEE, 2),
                TDEE_Ajustado = Math.Round(TDEE + ajuste, 2),
                DailyWater = Math.Round(waterConsumption, 2),
                Mensaje = "OK"
            };
        }
	}
}
