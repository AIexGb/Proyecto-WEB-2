using AutoMapper;
using NutriApi.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NutriApi.Business.Services
{
	public class GenericServiceAsync<TEntity, TDto> : ReadServiceAsync<TEntity, TDto>, IGenericServiceAsync<TEntity, TDto>
	where TEntity : class
	where TDto : class
	{
        private readonly IGenericRepository<TEntity> _genericRepository;
        private readonly IMapper _mapper;

        public GenericServiceAsync(IGenericRepository<TEntity> genericRepository, IMapper mapper) : base(genericRepository, mapper)
        {
            _genericRepository = genericRepository;
            _mapper = mapper;
        }

        public async Task AddAsync(TDto dto)
        {
            await _genericRepository.AddAsync(_mapper.Map<TEntity>(dto));
        }

        public async Task DeleteByIdAsync(int id)
        {
            await _genericRepository.DeleteByIdAsync(id);
        }

        public async Task UpdateAsync(TDto dto)
        {
            await _genericRepository.UpdateAsync(_mapper.Map<TEntity>(dto));
        }
    }
}
