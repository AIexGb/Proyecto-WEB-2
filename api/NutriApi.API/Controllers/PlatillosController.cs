using Microsoft.AspNetCore.Mvc;
using NutriApi.Business.DTOs;
using NutriApi.Business.Services;
using NutriApi.DataAccess.Interfaces;
using NutriApi.DataAccess.Models;

namespace NutriApi.API.Controllers
{
	[ApiController]
	[Route("/[controller]")]
	public class PlatillosController : ControllerBase
	{
        private readonly IKcalService _kcalService;
        private readonly ILogService _logService;
        private readonly IGenericServiceAsync<Platillo, PlatilloDTO> _platilloService;
        private readonly IPlatilloService _platilloServiceSpecial;


        public PlatillosController(IKcalService kcalService, ILogService logService, IGenericServiceAsync<Platillo, PlatilloDTO> platilloService, IPlatilloService platilloServiceSpecial)
        {
            _kcalService = kcalService;
            _logService = logService;
            _platilloService = platilloService;
            _platilloServiceSpecial = platilloServiceSpecial;
        }

        [HttpPost("{platilloId}/calcular-kcal")]
        public async Task<IActionResult> CalcularKcalPlatilloAsync(int platilloId)
        {
            var total = await _kcalService.CalcularKcalPlatilloAsync(platilloId);

            await _logService.AddLogAsync(
                dispositivo: Request.Headers["User-Agent"].ToString() ?? "Unknown",
                operacion: $"Calculo kcal platillo {platilloId}",
                tabla: "Platillo"
            );

            return Ok(new { PlatilloId = platilloId, TotalKcal = total });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var platillos = await _platilloServiceSpecial.GetAllWithIngredientesAsync();
            return Ok(platillos);
        }

        [HttpGet("byname")]
        public async Task<IActionResult> GetByNameAsync(string name)
        {
            var platillos = await _platilloServiceSpecial.GetByNameAsync(name);
            return Ok(platillos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var platillos = await _platilloService.GetByIdAsync(id);
            return Ok(platillos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PlatilloCreateDTO dto)
        {
            var result = await _platilloServiceSpecial.CreatePlatilloAsync(dto);
            await _logService.AddLogAsync(Request.Headers["User-Agent"].ToString(), $"Created new dish {dto.Nombre}", "Platillo");


            return Ok(new { Message = "Platillo created successfully" });
        }
    }
}
