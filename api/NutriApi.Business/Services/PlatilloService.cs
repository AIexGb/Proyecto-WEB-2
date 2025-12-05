using AutoMapper;
using NutriApi.Business.DTOs;
using NutriApi.DataAccess.Interfaces;
using NutriApi.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.Services
{
	public class PlatilloService : IPlatilloService
    {
        private readonly IPlatilloRepository _platilloRepository;
        private readonly IGenericRepository<PlatilloIngrediente> _platilloIngredienteRepository;
        private readonly IGenericRepository<Ingrediente> _ingredienteRepository;
        private readonly IMapper _mapper;

        public PlatilloService(
            IPlatilloRepository platilloRepository,
            IGenericRepository<PlatilloIngrediente> platilloIngredienteRepository,
            IGenericRepository<Ingrediente> ingredienteRepository,
            IMapper mapper
        )
        {
            _platilloRepository = platilloRepository;
            _platilloIngredienteRepository = platilloIngredienteRepository;
            _ingredienteRepository = ingredienteRepository;
            _mapper = mapper;
        }

        public async Task<PlatilloDTO> GetByNameAsync(string name)
        {
            var platillo = await _platilloRepository.GetByNameAsync(name);
            return _mapper.Map<PlatilloDTO>(platillo);
        }

        public async Task<List<PlatilloDTO>> GetAllWithIngredientesAsync()
        {
            var platillos = await _platilloRepository.GetAllWithIngredientesAsync();
            return _mapper.Map<List<PlatilloDTO>>(platillos);
        }

        public async Task<PlatilloDTO> CreatePlatilloAsync(PlatilloCreateDTO dto)
        {
            var platillo = new Platillo
            {
                Nombre = dto.Nombre,
                Fecha = DateTimeOffset.Now,
                KcalTotal = 0
            };

            await _platilloRepository.AddAsync(platillo);

            var ingredientesList = new List<PlatilloIngrediente>();

            foreach (var item in dto.Ingredientes)
            {
                if (item.Cantidad > 0)
                {
                    var ingrediente = await _ingredienteRepository.GetByIdAsync(item.IngredienteId);

                    if (ingrediente == null)
                        continue;

                    var pi = new PlatilloIngrediente
                    {
                        PlatilloId = platillo.PlatilloId,
                        IngredienteId = ingrediente.IngredienteId,
                        Cantidad = item.Cantidad,
                        Ingrediente = ingrediente
                    };

                    await _platilloIngredienteRepository.AddAsync(pi);
                    ingredientesList.Add(pi);
                }
            }

            double totalKcal = ingredientesList.Sum(pi =>
                ((pi.Ingrediente.proteinaG * 4) +
                 (pi.Ingrediente.grasasG * 9) +
                 (pi.Ingrediente.carbosG * 4)) * (pi.Cantidad / 100)
            );

            platillo.KcalTotal = (int)totalKcal;
            await _platilloRepository.SaveAsync();

            platillo.PlatilloIngredientes = ingredientesList;

            return _mapper.Map<PlatilloDTO>(platillo);
        }
    }
}
