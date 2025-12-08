// -----------------------------
// 1. VARIABLES GLOBALES
// -----------------------------
let recetasGuardadas = {
    'BotonPlatillo1': [],
    'BotonPlatillo2': [],
    'BotonPlatillo3': [],
    'BotonPlatillo4': [],
    'BotonPlatillo5': []
};
let platilloActivoId = 'BotonPlatillo1';
let platillosGuardadosParaMostrar = [];
let ingredientesFitness = [];
let contenedores = {};
const modalGuardar = document.querySelector('.contenido');
const btnGuardarNombre = document.getElementById('btnGuardar');

let ingredienteSeleccionado = null;
let categoriaSeleccionada = null;

// -----------------------------
// 2. FUNCIONES DE RECOPILACIÓN
// -----------------------------
function recopilarIngredientes() {
    const ingredientesPlatillo = [];
    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const filas = nutriente.querySelectorAll(".fila-entrada");
        filas.forEach(fila => {
            const nombre = fila.querySelector(".entrada-nombre").value.trim();
            const cantidad = fila.querySelector(".entrada-cantidad").value.trim();
            const categoria = nutriente.querySelector("h3").textContent.toLowerCase();
            if (nombre !== '' && cantidad !== '') {
                ingredientesPlatillo.push({
                    nombre: nombre,
                    cantidad: cantidad,
                    cat: categoria.includes("proteína") ? "proteina" :
                        categoria.includes("carbohidrato") ? "carb" :
                            categoria.includes("grasa") ? "grasas" : "otro"
                });
            }
        });
    });
    return ingredientesPlatillo;
}

// -----------------------------
// 3. GUARDADO DE PLATILLO
// -----------------------------
function guardarPlatilloActual() {
    const ingredientesPlatillo = recopilarIngredientes();
    recetasGuardadas[platilloActivoId] = ingredientesPlatillo;
}

// -----------------------------
// 4. LIMPIEZA Y CARGA
// -----------------------------
function limpiarFormulario() {
    document.querySelectorAll(".entrada-nombre").forEach(input => input.value = "");
    document.querySelectorAll(".entrada-cantidad").forEach(input => input.value = "");
    document.querySelectorAll(".burbuja-texto").forEach(b => b.remove());
}

function cargarPlatillo(id) {
    limpiarFormulario();
    platilloActivoId = id;
    actualizarClaseActivoTabs(id);
    const receta = recetasGuardadas[id] || [];
    if (receta.length > 0) {
        cargarIngredientesAlDom(receta);
    }
    
    calcularKcalTotales(); // recalcula al cargar
}

function cargarIngredientesAlDom(array) {
    array.forEach(ingrediente => {
        document.querySelectorAll(".nutriente").forEach(nutriente => {
            const h3 = nutriente.querySelector("h3").textContent.toLowerCase();
            if (
                (ingrediente.cat === "proteina" && h3.includes("proteína")) ||
                (ingrediente.cat === "carb" && h3.includes("carbohidrato")) ||
                (ingrediente.cat === "grasas" && h3.includes("grasa"))
            ) {
                let inputTarget = Array.from(nutriente.querySelectorAll(".entrada-nombre"))
                    .find(input => input.value === "");

                if (!inputTarget) {
                    const filaOriginal = nutriente.querySelector(".fila-entrada");
                    const nuevaFila = filaOriginal.cloneNode(true);
                    nuevaFila.querySelector(".entrada-nombre").value = ingrediente.nombre;
                    nuevaFila.querySelector(".entrada-cantidad").value = ingrediente.cantidad;
                    nutriente.appendChild(nuevaFila);
                    inputTarget = nuevaFila.querySelector(".entrada-nombre");
                    actualizarBurbuja(nuevaFila);
                } else {
                    const fila = inputTarget.closest('.fila-entrada');
                    inputTarget.value = ingrediente.nombre;
                    fila.querySelector('.entrada-cantidad').value = ingrediente.cantidad;
                    actualizarBurbuja(fila);
                }
            }
        });
    });
}

function actualizarClaseActivoTabs(id) {
    document.querySelectorAll('.platillos .boton-secundario').forEach(div => div.classList.remove('activo'));
    const divActivoPC = document.getElementById(id);
    if (divActivoPC) divActivoPC.classList.add('activo');

    const tabs = document.querySelectorAll('.tabs .tab');
    const numeroPlatillo = parseInt(id.replace('BotonPlatillo', ''));
    const indexActivo = numeroPlatillo - 1;
    tabs.forEach((tab, index) => {
        tab.classList.remove('activo');
        if (index === indexActivo) tab.classList.add('activo');
    });
}

// -----------------------------
// 5. FUNCIONES DE BURBUJAS
// -----------------------------
function actualizarBurbuja(fila) {
    const nombre = fila.querySelector('.entrada-nombre').value;
    const cantidad = parseInt(fila.querySelector('.entrada-cantidad').value) || 0;
    const datos = ingredientesFitness.find(i => i.nombre === nombre);
    if (!datos) return;

    let burbuja = fila.querySelector('.burbuja-texto');
    if (!burbuja) {
        burbuja = document.createElement('div');
        burbuja.classList.add('burbuja-texto');
        fila.appendChild(burbuja);
    }

    const kcalTotales = Math.round(datos.kcal_por_gramo * cantidad);
    burbuja.textContent = `Proteína: ${datos.proteinaG * (cantidad/100)}g | Carbos: ${datos.carbosG * (cantidad/100)}g | Grasas: ${datos.grasasG * (cantidad/100)}g | Kcal: ${kcalTotales}`;
}

// Actualiza la burbuja al cambiar la cantidad
document.addEventListener('input', e => {
    if (e.target.classList.contains('entrada-cantidad')) {
        e.target.value = e.target.value.replace(/\D/g, '');
        const fila = e.target.closest('.fila-entrada');
        actualizarBurbuja(fila);
    }
});

// -----------------------------
// 6. MANEJO DE INGREDIENTES SELECCIONADOS
// -----------------------------
document.addEventListener('click', e => {
    if (e.target.classList.contains('ingrediente')) {
        document.querySelectorAll('.ingrediente').forEach(d => d.classList.remove('seleccionado'));
        e.target.classList.add('seleccionado');

        ingredienteSeleccionado = e.target.textContent;
        categoriaSeleccionada = e.target.dataset.cat;
    }
});

// Agregar ingrediente al platillo
document.querySelector(".boton button").addEventListener("click", () => {
    if (!ingredienteSeleccionado || !categoriaSeleccionada) {
        alert("Selecciona primero un ingrediente.");
        return;
    }

    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const h3 = nutriente.querySelector("h3").textContent.toLowerCase();
        if (
            (categoriaSeleccionada === "proteina" && h3.includes("proteína")) ||
            (categoriaSeleccionada === "carb" && h3.includes("carbohidrato")) ||
            (categoriaSeleccionada === "grasas" && h3.includes("grasa"))
        ) {
            let inputTarget = Array.from(nutriente.querySelectorAll(".entrada-nombre"))
                .find(input => input.value === "");

            if (!inputTarget) {
                const filaOriginal = nutriente.querySelector(".fila-entrada");
                const nuevaFila = filaOriginal.cloneNode(true);
                nuevaFila.querySelector(".entrada-nombre").value = ingredienteSeleccionado;
                nuevaFila.querySelector(".entrada-cantidad").value = "0";
                nutriente.appendChild(nuevaFila);
                actualizarBurbuja(nuevaFila);
            } else {
                const fila = inputTarget.closest('.fila-entrada');
                inputTarget.value = ingredienteSeleccionado;
                fila.querySelector('.entrada-cantidad').value = "0";
                actualizarBurbuja(fila);
            }
        }
    });

    document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
    ingredienteSeleccionado = null;
    categoriaSeleccionada = null;

    setTimeout(calcularKcalTotales, 50); // recalcular kcal al agregar
});

// -----------------------------
// 7. FILTROS POR CATEGORÍA Y BÚSQUEDA
// -----------------------------
document.getElementById("FiltroCategoria").addEventListener('change', () => {
    const valor = document.getElementById("FiltroCategoria").value;
    document.querySelectorAll('.ingrediente').forEach(i => {
        i.style.display = (valor === "todos" || i.dataset.cat === valor) ? "block" : "none";
    });
});

document.getElementById("BusquedaIngrediente").addEventListener('input', () => {
    const valor = document.getElementById("BusquedaIngrediente").value.toLowerCase();
    document.querySelectorAll('.ingrediente').forEach(i => {
        i.style.display = i.textContent.toLowerCase().includes(valor) ? "block" : "none";
    });
});

// -----------------------------
// 8. BOTONES ACCIÓN (Guardar, Limpiar, Imprimir)
// -----------------------------
document.getElementById("BotonLimpiar").addEventListener("click", () => {
    limpiarFormulario();
    guardarPlatilloActual();
});

document.getElementById("BotonGuardar").addEventListener("click", () => {
    guardarPlatilloActual();
    if (recetasGuardadas[platilloActivoId].length === 0) {
        alert("No hay ingredientes para guardar en este platillo. Por favor, agrega al menos un ingrediente.");
        return;
    }
    if (modalGuardar) modalGuardar.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

document.getElementById("BotonImprimir").addEventListener("click", () => {
    prepararEImprimirPlatillosConDiccionario();
});

btnGuardarNombre.addEventListener("click", () => {
    const nombreInput = modalGuardar.querySelector('.nombre');
    const nombrePlatillo = nombreInput.value.trim();
    if (nombrePlatillo) {
        const datosPlatillo = {
            nombre: nombrePlatillo,
            ingredientes: recetasGuardadas[platilloActivoId]
        };
        platillosGuardadosParaMostrar.push(datosPlatillo);
        nombreInput.value = '';
        modalGuardar.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        alert("Por favor, ingresa un nombre para el platillo.");
    }
});

// -----------------------------
// 9. INICIALIZACIÓN
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
    contenedores = {
        proteina: document.getElementById("Proteina"),
        carb: document.getElementById("Carbohidratos"),
        grasas: document.getElementById("Grasas")
    };

    inicializarManejoPlatillos();
    cargarIngredientesDelAPI();
    cargarPlatillosDelApi();
});

// -----------------------------
// 10. CÁLCULOS DE KCAL Y OPTIMO POR PLATILLO
// -----------------------------
function calcularKcalTotales() {
    let kcalTotales = 0;
    let proteinasTotales = 0;
    let grasasTotales = 0;
    let carbosTotales = 0;
    let numPlatillosActivos = 0;

    // Recorre los 5 posibles platillos
    for (let i = 1; i <= 5; i++) {
        const platilloId = `BotonPlatillo${i}`;
        const platillo = recetasGuardadas[platilloId];

        if (platillo && platillo.length > 0) {
            numPlatillosActivos++;

            platillo.forEach(ingrediente => {
                const datos = ingredientesFitness.find(i => i.nombre === ingrediente.nombre);
                if (datos) {
                    const cantidad = parseFloat(ingrediente.cantidad) || 0;
                    kcalTotales += datos.kcal_por_gramo * cantidad;
                    proteinasTotales += datos.proteinaG * (cantidad/100);
                    grasasTotales += datos.grasasG * (cantidad/100);
                    carbosTotales += datos.carbosG * (cantidad/100);
                }
            });
        }
    }

    // Actualizar campos en el DOM
    const inputActual = document.getElementById("InputActual");
    if (inputActual) inputActual.value = Math.round(kcalTotales);

    const inputProteinas = document.getElementById("InputProteinasTotales");
    if (inputProteinas) inputProteinas.value = Math.round(proteinasTotales);

    const inputGrasas = document.getElementById("InputGrasasTotales");
    if (inputGrasas) inputGrasas.value = Math.round(grasasTotales);

    const inputCarbos = document.getElementById("InputCarbosTotales");
    if (inputCarbos) inputCarbos.value = Math.round(carbosTotales);

    const caloriasOptimas = parseFloat(sessionStorage.getItem('caloriasOptimas')) || 0;
    const inputOptimoPP = document.getElementById("InputOptimoPP");
    if (inputOptimoPP) {
        let divisor = Math.max(3, numPlatillosActivos); // mínimo 3, si hay más platillos se divide entre su número
        inputOptimoPP.value = Math.round(caloriasOptimas / divisor);
    }

    const inputOptimo = document.getElementById("InputOptimo");
    if (inputOptimo) inputOptimo.value = Math.round(caloriasOptimas);

    const inputKcalTotales = document.getElementById("InputKcalTotales");
    if (inputKcalTotales) inputKcalTotales.value = Math.round(kcalTotales);
}


// -----------------------------
// 11. CÁLCULO DE CALORÍAS REALISTA
// -----------------------------
function calcularCaloriasRealistas({ pesoKg, alturaM, sexo, actividad, objetivo }) {
    const alturaPulgadas = alturaM / 0.0254;
    let pesoIdeal;
    if (sexo === "hombre") {
        pesoIdeal = 50 + 2.3 * (alturaPulgadas - 60);
    } else {
        pesoIdeal = 45.5 + 2.3 * (alturaPulgadas - 60);
    }

    const pesoAjustado = (pesoKg - pesoIdeal) * 0.25 + pesoIdeal;
    const ger = 25 * pesoAjustado;

    const factoresActividad = {
        sedentario: 1.35,
        ligero: 1.55,
        moderado: 1.65,
        intenso: 1.8,
        muy_intenso: 2.1
    };
    const fa = factoresActividad[actividad] || 1.5;
    const tdee = ger * fa;

    let caloriasObjetivo;
    if (objetivo === "bajar") caloriasObjetivo = tdee * 0.8;
    else if (objetivo === "subir") caloriasObjetivo = tdee * 1.15;
    else caloriasObjetivo = tdee;

    return {
        ger: Math.round(ger),
        tdee: Math.round(tdee),
        caloriasObjetivo: Math.round(caloriasObjetivo)
    };
}

function actualizarCaloriasPlanificador() {
    const peso = parseFloat(document.querySelectorAll(".grupo-formulario input")[0].value);
    const altura = parseFloat(document.querySelectorAll(".grupo-formulario input")[1].value);
    const actividad = document.querySelectorAll(".grupo-formulario select")[0].value;
    const objetivo = document.querySelectorAll(".grupo-formulario select")[1].value;
    const sexoInput = document.querySelector('input[name="sexo"]:checked');
    if (!peso || !altura || !actividad || !objetivo || !sexoInput) return;
    const sexo = sexoInput.value;

    const { caloriasObjetivo } = calcularCaloriasRealistas({ pesoKg: peso, alturaM: altura, sexo, actividad, objetivo });
    sessionStorage.setItem('caloriasOptimas', caloriasObjetivo);

    calcularKcalTotales();

    const campoAgua = document.getElementById("InputAgua");
    if (campoAgua) {
        const aguaLitros = (peso * 0.035).toFixed(2);
        campoAgua.value = aguaLitros + " L";
        sessionStorage.setItem("AguaRecomendada", aguaLitros);
    }
}

// -----------------------------
// 12. CONECTAR AL FORMULARIO
// -----------------------------
document.querySelector(".formulario").addEventListener("submit", function (e) {
    e.preventDefault();
    actualizarCaloriasPlanificador();

    document.getElementById("TextoInicial").style.display = "none";
    document.getElementById("ContenedorResultados").style.display = "block";
});
