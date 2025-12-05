using NutriApi.Business.DTOs;
using NutriApi.DataAccess.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace NutriApi.Business.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Ingrediente, IngredienteDTO>()
                .ReverseMap();

            CreateMap<PlatilloIngrediente, PlatilloIngredienteDTO>()
                .ForMember(x => x.IngredienteNombre,
                    opt => opt.MapFrom(src => src.Ingrediente.Nombre))
                .ReverseMap();

            CreateMap<Platillo, PlatilloDTO>()
                .ForMember(dest => dest.PlatilloIngredientes, opt =>
                    opt.MapFrom(src =>
                        src.PlatilloIngredientes.Select(pi => new PlatilloIngredienteDTO
                        {
                            IngredienteNombre = pi.Ingrediente.Nombre,
                            Cantidad = pi.Cantidad
                        }).ToList()
                    )
                );
        }
    }


}
