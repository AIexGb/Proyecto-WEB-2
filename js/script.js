// menú móvil
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('AlternarMenu');
  const sidebar = document.getElementById('BarraLateral');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('activa');
    });

    document.addEventListener('click', function(e) {
      if (sidebar.classList.contains('activa') && 
          !sidebar.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        sidebar.classList.remove('activa');
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && sidebar.classList.contains('activa')) {
        sidebar.classList.remove('activa');
      }
    });
  }
});



document.querySelector(".formulario").addEventListener("submit", function (e) {
    e.preventDefault(); 

    // Obtener valores
    let peso = parseFloat(document.querySelectorAll(".grupo-formulario input")[0].value);
    let altura = parseFloat(document.querySelectorAll(".grupo-formulario input")[1].value);
    let actividad = document.querySelectorAll(".grupo-formulario select")[0].value;
    let objetivo = document.querySelectorAll(".grupo-formulario select")[1].value;
    let sexo = document.querySelector('input[name="sexo"]:checked');

    if (!peso || !altura || !actividad || !objetivo || !sexo) {
        alert("Por favor completa todos los campos.");
        return;
    }

    altura /= 100; // cm a m

   
    let tmb = (sexo.value === "hombre")
        ? 10 * peso + 6.25 * (altura * 100) - 5 * 25 + 5
        : 10 * peso + 6.25 * (altura * 100) - 5 * 25 - 161;

    const factorActividad = {
        sedentario: 1.2,
        ligero: 1.375,
        moderado: 1.55,
        intenso: 1.725,
        muy_intenso: 1.9
    };

    let caloriasActividad = tmb * factorActividad[actividad];
    let caloriasObjetivo = (objetivo === "bajar") 
        ? caloriasActividad - 400
        : (objetivo === "subir")
        ? caloriasActividad + 300
        : caloriasActividad;

    // Mostrar resultados
    document.getElementById("Tmb").value = Math.round(tmb) + " kcal";
    document.getElementById("CaloriasActividad").value = Math.round(caloriasActividad) + " kcal";
    document.getElementById("CaloriasObjetivo").value = Math.round(caloriasObjetivo) + " kcal";

    // Guardar calorías óptimas en localStorage para la siguiente página
    localStorage.setItem('caloriasOptimas', Math.round(caloriasObjetivo));

    // Ocultar texto inicial
    document.getElementById("TextoInicial").style.display = "none";

    // Mostrar resultados
    document.getElementById("ContenedorResultados").style.display = "block";

    // Habilitar botón siguiente
    const BotonSiguiente = document.getElementById("BotonSiguiente");
    const ContenedorBoton = document.getElementById("ContenedorBoton");
    document.querySelector(".resultados").appendChild(ContenedorBoton);
    BotonSiguiente.disabled = false;

});


