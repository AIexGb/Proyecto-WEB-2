using Microsoft.AspNetCore.Mvc;
using NutriApi.Business.DTOs;
using NutriApi.Business.Services;

namespace NutriApi.API.Controllers
{
	[ApiController]
	[Route("/[controller]")]
	public class CalcCaloricIntakeController : ControllerBase
	{
        private readonly ICalcCaloricIntakeService _calcCaloricIntakeService;

        public CalcCaloricIntakeController(ICalcCaloricIntakeService calcCaloricIntakeService)
        {
            _calcCaloricIntakeService = calcCaloricIntakeService;
        }

        [HttpPost("calcular-kcal-intake")]
        public async Task<IActionResult> CalcCaloricIntakeAsync([FromBody] KcalRequestDto request)
        {
            CalculoResponseDTO result = await _calcCaloricIntakeService.CalcCaloricIntakeAsync(request.Gender, request.Weight, request.Height, request.Activity, request.Objective);
            return Ok(result);
        }

        [HttpGet("calcular-kcal-intake-GET")]
        public async Task<IActionResult> CalcCaloricIntakeAsync(
        bool gender,
        double weight,
        int height,
        double activity,
        int objective)
        {
            CalculoResponseDTO result = await _calcCaloricIntakeService.CalcCaloricIntakeAsync(
                gender, weight, height, activity, objective);

            return Ok(result);
        }


    }
}
