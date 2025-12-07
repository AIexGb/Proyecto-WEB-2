// ===========================
// VARIABLES GLOBALES
// ===========================
let ingredientesFitness = [];
let contenedores = {};
let caloriasMap = {};
let recetasGuardadas = JSON.parse(sessionStorage.getItem('recetasGuardadas')) || {};
let platilloActivoId = 'BotonPlatillo1';
let platosCreados = [];
let platillosGuardadosParaMostrar = [];
let platillosGuardadosUsuario = [];

let ingredienteSeleccionado = null;
let categoriaSeleccionada = null;

// ===========================
// FUNCIONES DE CARGA
// ===========================

function cargarIngredientesDelAPI() {
    (async () => {
        const response = await apiGetIngredientes();

        response.forEach(i => {
            const kcal_por_gramo = ((i.proteinaG * 4) + (i.carbosG * 4) + (i.grasasG * 9)) / 100;
            let t = i.tipo === "proteína" ? "proteina" :
                    i.tipo === "carbohidrato" ? "carb" :
                    i.tipo === "grasa" ? "grasas" :
                    i.tipo;

            ingredientesFitness.push({
                ingredienteId: i.ingredienteId,
                nombre: i.nombre,
                cat: t,
                kcal_por_gramo,
                proteinaG: i.proteinaG,
                carbosG: i.carbosG,
                grasasG: i.grasasG
            });
        });

        // Crear elementos en DOM
        ingredientesFitness.forEach(i => {
            const div = document.createElement("div");
            div.classList.add("ingrediente");
            div.textContent = i.nombre;
            div.dataset.cat = i.cat;
            contenedores[i.cat].appendChild(div);
        });

        // Map para cálculo rápido de calorías
        caloriasMap = ingredientesFitness.reduce((map, item) => {
            map[item.nombre] = item.kcal_por_gramo;
            return map;
        }, {});
    })();
}

function cargarPlatillosDelApi() {
    (async () => {
        const response = await apiGetPlatillos();

        response.forEach(i => {
            platillosGuardadosParaMostrar.push({
                nombre: i.nombre,
                kCalTotal: i.kCalTotal,
                platilloIngredientes: i.platilloIngredientes
            });
        });

        actualizarPlatillosGuardadosUI();
    })();
}

// ===========================
// FUNCIONES DE CALCULO
// ===========================

function actualizarCaloriasActuales() {
    let caloriasTotales = 0;
    document.querySelectorAll(".fila-entrada").forEach(fila => {
        const nombre = fila.querySelector(".entrada-nombre").value;
        const cantidadGramos = parseInt(fila.querySelector(".entrada-cantidad").value) || 0;
        if (nombre && caloriasMap[nombre]) {
            caloriasTotales += caloriasMap[nombre] * cantidadGramos;
        }
    });
    document.getElementById("InputActual").value = Math.round(caloriasTotales) + " kcal";
}

function actualizarBurbuja(fila, datos) {
    let burbuja = fila.querySelector(".burbuja-texto");
    if (!burbuja) {
        burbuja = document.createElement("div");
        burbuja.classList.add("burbuja-texto");
        fila.appendChild(burbuja);
    }

    const cantidad = parseInt(fila.querySelector(".entrada-cantidad").value) || 0;
    const calorias = ((datos.proteinaG * 4) + (datos.carbosG * 4) + (datos.grasasG * 9)) * (cantidad / 100);

    burbuja.textContent =
        `Proteína: ${datos.proteinaG}g | Carbos: ${datos.carbosG}g | Grasas: ${datos.grasasG}g | Kcal: ${calorias.toFixed(1)} kcal`;
}

// ===========================
// FUNCIONES DE GESTIÓN DE PLATILLOS
// ===========================

function guardarPlatilloActual() {
    const ingredientesPlatillo = [];

    document.querySelectorAll(".fila-entrada").forEach(fila => {
        const nombre = fila.querySelector(".entrada-nombre").value;
        const cantidad = fila.querySelector(".entrada-cantidad").value;
        if (nombre && cantidad) {
            ingredientesPlatillo.push({ nombre, cantidad });
        }
    });

    if (!platosCreados.find(p => p.platoId === platilloActivoId) && ingredientesPlatillo.length > 0) {
        platosCreados.push({ platoId: platilloActivoId, ingredientes: ingredientesPlatillo });
    }

    const OptimoPP = platosCreados.length > 3 ?
        Number(sessionStorage.getItem("caloriasOptimas")) / platosCreados.length :
        Number(sessionStorage.getItem("caloriasOptimas")) / 3;

    document.getElementById("InputOptimoPP").value = Math.round(OptimoPP) + " kcal";

    alert(`Platillo "${platilloActivoId}" guardado con ${ingredientesPlatillo.length} ingredientes.`);
    recetasGuardadas[platilloActivoId] = ingredientesPlatillo;
    sessionStorage.setItem('recetasGuardadas', JSON.stringify(recetasGuardadas));
}

function cargarPlatillo(id) {
    // Limpiar filas existentes
    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const filas = Array.from(nutriente.querySelectorAll(".fila-entrada"));
        filas.slice(1).forEach(fila => fila.remove());
        if (filas.length > 0) {
            filas[0].querySelector(".entrada-nombre").value = "";
            filas[0].querySelector(".entrada-cantidad").value = "";
            const burbuja = filas[0].querySelector(".burbuja-texto");
            if (burbuja) burbuja.textContent = "macros p/c 100g []";
        }
    });

    platilloActivoId = id;
    actualizarClaseActivoTabs(id);

    const receta = recetasGuardadas[id] || [];
    const inputContador = { 'proteina': 0, 'carb': 0, 'grasas': 0 };

    receta.forEach((item) => {
        const ingredienteData = ingredientesFitness.find(i => i.nombre === item.nombre);
        if (!ingredienteData) return;

        const categoria = ingredienteData.cat;
        let nutrienteContenedor = null;

        document.querySelectorAll('.nutriente').forEach(nutriente => {
            const titulo = nutriente.querySelector('h3')?.textContent.toLowerCase();
            if (!titulo) return;
            if ((categoria === 'proteina' && titulo.includes('proteína')) ||
                (categoria === 'carb' && titulo.includes('carbohidrato')) ||
                (categoria === 'grasas' && titulo.includes('grasa'))) {
                nutrienteContenedor = nutriente;
            }
        });

        if (nutrienteContenedor) {
            let filaTarget = inputContador[categoria] === 0 ?
                nutrienteContenedor.querySelector(".fila-entrada") :
                nutrienteContenedor.querySelector(".fila-entrada").cloneNode(true);

            if (inputContador[categoria] !== 0) {
                filaTarget.querySelector(".entrada-nombre").value = "";
                filaTarget.querySelector(".entrada-cantidad").value = "";
                nutrienteContenedor.appendChild(filaTarget);
            }

            filaTarget.querySelector(".entrada-nombre").value = item.nombre;
            filaTarget.querySelector(".entrada-cantidad").value = item.cantidad;

            actualizarBurbuja(filaTarget, ingredienteData);

            filaTarget.querySelector(".entrada-cantidad").addEventListener("input", () => {
                actualizarBurbuja(filaTarget, ingredienteData);
                actualizarCaloriasActuales();
            });

            inputContador[categoria]++;
        }
    });

    actualizarCaloriasActuales();
}

function actualizarClaseActivoTabs(id) {
    document.querySelectorAll('.platillos .boton-secundario').forEach(div => div.classList.remove('activo'));
    document.getElementById(id)?.classList.add('activo');

    const numeroPlatillo = parseInt(id.replace('BotonPlatillo', ''));
    document.querySelectorAll('.tabs .tab').forEach((tab, index) => {
        tab.classList.toggle('activo', index === numeroPlatillo - 1);
    });
}

// ===========================
// INICIALIZACIÓN Y EVENTOS
// ===========================

function inicializarCalculoCalorias() {
    const inputOptimo = document.getElementById('InputOptimo');
    const caloriasOptimas = sessionStorage.getItem('caloriasOptimas');
    if (inputOptimo) inputOptimo.value = caloriasOptimas ? caloriasOptimas + " kcal" : "N/D";

    document.querySelector(".abajo").addEventListener('input', (e) => {
        if (e.target.classList.contains('entrada-cantidad')) actualizarCaloriasActuales();
    });
}

function inicializarBotonesPlatillos() {
    const elementosNavegacion = document.querySelectorAll('.platillos button, .tabs .tab');
    elementosNavegacion.forEach(elemento => {
        elemento.addEventListener('click', () => {
            let idParaCargar;
            if (elemento.closest('.platillos')) {
                idParaCargar = elemento.closest('.boton-secundario')?.id;
            } else if (elemento.closest('.tabs')) {
                const tabs = Array.from(document.querySelectorAll('.tabs .tab'));
                const index = tabs.indexOf(elemento);
                idParaCargar = `BotonPlatillo${index + 1}`;
            }
            if (idParaCargar && idParaCargar !== platilloActivoId) {
                guardarPlatilloActual();
                cargarPlatillo(idParaCargar);
            }
        });
    });
    cargarPlatillo(platilloActivoId);
}

// ===========================
// MANEJO DE INGREDIENTES
// ===========================

document.addEventListener("click", e => {
    if (e.target.classList.contains("ingrediente")) {
        document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
        e.target.classList.add("seleccionado");
        ingredienteSeleccionado = e.target.textContent;
        categoriaSeleccionada = e.target.dataset.cat;
    }
});

document.querySelector(".boton button").addEventListener("click", () => {
    if (!ingredienteSeleccionado || !categoriaSeleccionada) return alert("Selecciona primero un ingrediente.");

    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const h3 = nutriente.querySelector("h3")?.textContent.toLowerCase();
        if (!h3) return;

        if ((categoriaSeleccionada === "proteina" && h3.includes("proteína")) ||
            (categoriaSeleccionada === "carb" && h3.includes("carbohidrato")) ||
            (categoriaSeleccionada === "grasas" && h3.includes("grasa"))) {

            let inputTarget = Array.from(nutriente.querySelectorAll(".entrada-nombre")).find(input => input.value === "");

            if (!inputTarget) {
                const filaOriginal = nutriente.querySelector(".fila-entrada");
                const nuevaFila = filaOriginal.cloneNode(true);
                nuevaFila.querySelector(".entrada-nombre").value = "";
                nuevaFila.querySelector(".entrada-cantidad").value = "";
                nutriente.appendChild(nuevaFila);
                inputTarget = nuevaFila.querySelector(".entrada-nombre");
            }

            inputTarget.value = ingredienteSeleccionado;
            const fila = inputTarget.closest(".fila-entrada");
            fila.querySelector(".entrada-cantidad").value = "0";

            const datos = ingredientesFitness.find(x => x.nombre === ingredienteSeleccionado);
            actualizarBurbuja(fila, datos);

            fila.querySelector(".entrada-cantidad").addEventListener("input", () => {
                actualizarBurbuja(fila, datos);
                actualizarCaloriasActuales();
            });

            actualizarCaloriasActuales();
        }
    });

    document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
    ingredienteSeleccionado = null;
    categoriaSeleccionada = null;
});

document.querySelector(".abajo").addEventListener('click', (e) => {
    if (e.target.classList.contains('boton-equis')) manejarEliminacion(e.target.closest(".fila-entrada"));
});

// ===========================
// EVENTO DOM CONTENT LOADED
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    contenedores = {
        proteina: document.getElementById("Proteina"),
        carb: document.getElementById("Carbohidratos"),
        grasas: document.getElementById("Grasas")
    };

    cargarIngredientesDelAPI();
    inicializarCalculoCalorias();
    inicializarBotonesPlatillos();
    actualizarPlatillosGuardadosUI();
    cargarPlatillosDelApi();
    guardarPlatilloActual();

    window.addEventListener('beforeunload', () => guardarPlatilloActual());
});
