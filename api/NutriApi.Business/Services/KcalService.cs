using NutriApi.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.Services
{
	public class KcalService : IKcalService
	{
        private readonly IPlatilloRepository _platilloRepository;

        public KcalService(IPlatilloRepository platilloRepository)
        {
            _platilloRepository = platilloRepository;
        }

        public async Task<double> CalcularKcalPlatilloAsync(int platilloId)
        {
            var platillo = await _platilloRepository.GetByIdAsync(platilloId);

            if (platillo == null)
                throw new Exception("Platillo no encontrado.");

            double totalKcal = platillo.PlatilloIngredientes.Sum(pi =>
                ((pi.Ingrediente.proteinaG * 4) + (pi.Ingrediente.grasasG * 9) + (pi.Ingrediente.carbosG * 4)) * (pi.Cantidad / 100));

            platillo.KcalTotal = (int)totalKcal;

            return totalKcal;
        }
    }
}
