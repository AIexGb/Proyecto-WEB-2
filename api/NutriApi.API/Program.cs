using Microsoft.EntityFrameworkCore;
using NutriApi.Business.Mappings;
using NutriApi.Business.Services;
using NutriApi.DataAccess.Interfaces;
using NutriApi.DataAccess.Repositories;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<NutriDbContext>(options =>
	options.UseSqlServer(connString));

//// AutoMapper Configuration
builder.Services.AddAutoMapper(typeof(MappingProfile));

//// Generic Repository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IPlatilloRepository, PlatilloRepository>();

//// Generic Services
builder.Services.AddScoped(typeof(IReadServiceAsync<,>), typeof(ReadServiceAsync<,>));
builder.Services.AddScoped(typeof(IGenericServiceAsync<,>), typeof(GenericServiceAsync<,>));
builder.Services.AddScoped<IPlatilloService, PlatilloService>();

////// Services
builder.Services.AddScoped(typeof(IKcalService), typeof(KcalService));
builder.Services.AddScoped(typeof(ICalcCaloricIntakeService), typeof(CalcCaloricIntakeService));
builder.Services.AddScoped(typeof(ILogService), typeof(LogService));

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddControllers()
	.AddJsonOptions(options =>
	{
		options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
		options.JsonSerializerOptions.WriteIndented = true;
	});

///// CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", builder =>
	{
		builder.WithOrigins("https://www.nutriweb.com")
			   .AllowAnyHeader()
			   .AllowAnyMethod();
	});
});


var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
