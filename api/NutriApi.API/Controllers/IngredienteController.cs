using Microsoft.AspNetCore.Mvc;
using NutriApi.Business.DTOs;
using NutriApi.Business.Services;
using NutriApi.DataAccess.Interfaces;
using NutriApi.DataAccess.Models;

namespace NutriApi.API.Controllers
{
	[ApiController]
	[Route("/[controller]")]
	public class IngredienteController : ControllerBase
	{
        private readonly ILogService _logService;
        private readonly IGenericServiceAsync<Ingrediente, IngredienteDTO> _ingredienteService;

        public IngredienteController(ILogService logService, IGenericServiceAsync<Ingrediente, IngredienteDTO> ingredienteService)
        {
            _logService = logService;
            _ingredienteService = ingredienteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ingredientes = await _ingredienteService.GetAllAsync();
            return Ok(ingredientes);
        }

    }
}
