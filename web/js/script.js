

// menú móvil
  const menuToggle = document.getElementById("mobile-menu");
  const nav = document.querySelector("nav");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    nav.classList.toggle("active");
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

    const factorActividad = {
        sedentario: 1.35,
        ligero: 1.55,
        moderado: 1.65,
        intenso: 1.825,
        muy_intenso: 2.1
    };

    const factorObjetivo = {
        bajar:1,
        mantener: 2,
        subir: 3
    };

    (async () => {
      try {
        var sexoBool;
        if (sexo.value === "hombre") {
          sexoBool = true;
        } else {
          sexoBool = false;
        }
        var act = factorActividad[actividad]
        var obj = factorObjetivo[objetivo]
        const response = await apiCalcularIntakeGET({ peso, altura, sexo:sexoBool, actividad:act, objetivo:obj });

        let tmb = response.ger;
        let caloriasActividad = response.tdee;
        let caloriasObjetivo = response.tdeE_Ajustado;
        let aguaLitros = response.dailyWater;

            //  MOSTRAR RESULTADOS 
        document.getElementById("Tmb").value = Math.round(tmb) + " kcal";
        document.getElementById("CaloriasActividad").value = Math.round(caloriasActividad) + " kcal";
        document.getElementById("CaloriasObjetivo").value = Math.round(caloriasObjetivo) + " kcal";


        // esto es para que la pagina anterior sirva
        const campoAgua = document.getElementById("InputAgua");
        if (campoAgua !== null) {
            campoAgua.value = aguaLitros.toFixed(2) + " L";
        }

          // localStorage para usarlo en otra página
          localStorage.setItem("aguaRecomendada", aguaLitros.toFixed(2));


            //localStorage para la siguiente página
            localStorage.setItem('caloriasOptimas', Math.round(caloriasObjetivo));

            // Se guarda el id, etiqueta y un mensaje motivacional.
            localStorage.setItem('actividadNivel', actividad);

            const actividadLabels = {
              sedentario: 'Sedentario',
              ligero: 'Actividad ligera',
              moderado: 'Actividad moderada',
              intenso: 'Actividad intensa',
              muy_intenso: 'Actividad muy intensa'
            };

            const mensajesMotivacionales = {
              sedentario: '¡Pequeños pasos cuentan! Intenta caminar 10–15 minutos al día y ve aumentando gradualmente. Consejo de sueño: intenta dormir 7–9 horas y evita pantallas 30 minutos antes de acostarte.',
              ligero: '¡Bien hecho! Mantén tu constancia y añade 10 minutos más a tus sesiones si te sientes con energía. Consejo de sueño: apunta a 7–9 horas y sigue una rutina relajante antes de dormir.',
              moderado: '¡Excelente! Continúa con este ritmo y considera incluir fuerza 2 veces por semana. Consejo de sueño: duerme 7–9 horas y añade estiramientos suaves para mejorar la recuperación muscular.',
              intenso: '¡Genial! Mantén una buena recuperación y escucha a tu cuerpo para evitar sobrecargas. Consejo de sueño: prioriza el sueño profundo (7–9 horas) y evita entrenar muy tarde.',
              muy_intenso: '¡Eres un atleta! Prioriza la recuperación, la nutrición y el sueño para rendir al máximo. Consejo de sueño: procura 7–9 horas, mejora la higiene del sueño y considera siestas cortas cuando las necesites.'
            };

            //mensaje para usar despues
            localStorage.setItem('actividadLabel', actividadLabels[actividad] || actividad);
            localStorage.setItem('mensajeMotivacional', mensajesMotivacionales[actividad] || '¡Sigue así!');

            document.getElementById("TextoInicial").style.display = "none";

            document.getElementById("ContenedorResultados").style.display = "block";

            //habilitar botón siguiente
            const BotonSiguiente = document.getElementById("BotonSiguiente");
            const ContenedorBoton = document.getElementById("ContenedorBoton");
            document.querySelector(".resultados").appendChild(ContenedorBoton);
            BotonSiguiente.disabled = false;
      } catch (error) {
        // API call failed; abort silently or handle in UI if desired
        return;
      }
    })();

    

});


