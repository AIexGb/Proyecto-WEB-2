/*const ingredientesFitness = [
    // Grasas (9 kcal/g)
    { nombre: "Aceite de Oliva", cat: "grasas", kcal_por_gramo: 9.0 }, 
    { nombre: "Aguacate", cat: "grasas", kcal_por_gramo: 1.6 },
    { nombre: "Frutos Secos", cat: "grasas", kcal_por_gramo: 6.0 }, 
    { nombre: "Salmón", cat: "grasas", kcal_por_gramo: 2.0 }, 
    { nombre: "Semillas", cat: "grasas", kcal_por_gramo: 5.5 }, 
    
    // Carbohidratos (4 kcal/g)
    { nombre: "Arroz", cat: "carb", kcal_por_gramo: 1.3 },
    { nombre: "Avena", cat: "carb", kcal_por_gramo: 3.8 },
    { nombre: "Camote", cat: "carb", kcal_por_gramo: 0.8 },
    { nombre: "Quinoa", cat: "carb", kcal_por_gramo: 1.4 },
    { nombre: "Pasta", cat: "carb", kcal_por_gramo: 1.5 },
    
    // Proteínas (4 kcal/g)
    { nombre: "Carne Roja", cat: "proteina", kcal_por_gramo: 2.5 }, 
    { nombre: "Huevo", cat: "proteina", kcal_por_gramo: 1.4 },
    { nombre: "Legumbres", cat: "proteina", kcal_por_gramo: 1.1 },
    { nombre: "Pescado", cat: "proteina", kcal_por_gramo: 1.0 },
    { nombre: "Pollo", cat: "proteina", kcal_por_gramo: 1.6 }
];*/
ingredientesFitness = [];
// Contenedores (Se inicializarán en DOMContentLoaded para evitar errores)
let contenedores = {}; 


caloriasMap = {};



let recetasGuardadas = JSON.parse(localStorage.getItem('recetasGuardadas')) || {};
let platilloActivoId = 'BotonPlatillo1';
let platillosGuardadosParaMostrar = JSON.parse(localStorage.getItem('platillosGuardadosParaMostrar')) || []; 



// FUNCIONES DE CÁLCULO Y GESTIÓN DE ESTADO


function cargarIngredientesDelAPI(){
    (async () => {
    const response = await apiGetIngredientes();
    console.log("Ingredientes desde API:", response);

    response.forEach(i => {
        const kcal_por_gramo = ((i.proteinaG * 4) + (i.carbosG * 4) + (i.grasasG * 9)) / 100;
        let t;
        if (i.tipo === "proteína") t = "proteina";
        else if (i.tipo === "carbohidrato") t = "carb";
        else if (i.tipo === "grasa") t = "grasas";
        else t = t.tipo;
        console.log({ nombre: i.nombre, cat: t, kcal_por_gramo });

        ingredientesFitness.push({
            nombre: i.nombre,
            cat: t,
            kcal_por_gramo
        });
    });

        
    ingredientesFitness.forEach(i => {
        const div = document.createElement("div");
        div.classList.add("ingrediente");
        div.textContent = i.nombre;
        div.dataset.cat = i.cat;
        contenedores[i.cat].appendChild(div);
    });

    caloriasMap = ingredientesFitness.reduce((map, item) => {
        map[item.nombre] = item.kcal_por_gramo;
        return map;
    }, {});
})();

    
}

function actualizarCaloriasActuales() {
    let caloriasTotales = 0;
    
    document.querySelectorAll(".fila-entrada").forEach(fila => {
        const nombre = fila.querySelector(".entrada-nombre").value;
        const cantidadStr = fila.querySelector(".entrada-cantidad").value;
        
        const cantidadGramos = parseInt(cantidadStr) || 0;
        if (nombre && caloriasMap[nombre]) {
            caloriasTotales += caloriasMap[nombre] * cantidadGramos;
        }
    });

    // Aseguramos que el nombre de la variable de cálculo sea consistente
    document.getElementById("InputActual").value = Math.round(caloriasTotales) + " kcal";
}

function guardarPlatilloActual() {
    const ingredientesPlatillo = [];

    document.querySelectorAll(".fila-entrada").forEach(fila => {
        const nombre = fila.querySelector(".entrada-nombre").value;
        const cantidad = fila.querySelector(".entrada-cantidad").value;
        
        if (nombre && cantidad) {
            ingredientesPlatillo.push({
                nombre: nombre,
                cantidad: cantidad 
            });
        }
    });

    recetasGuardadas[platilloActivoId] = ingredientesPlatillo;
    localStorage.setItem('recetasGuardadas', JSON.stringify(recetasGuardadas));
}

function cargarPlatillo(id) {
    // 1. Limpieza total y reinicio del DOM
    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const filas = Array.from(nutriente.querySelectorAll(".fila-entrada"));
        
        filas.slice(1).forEach(fila => fila.remove());
        
        if (filas.length > 0) {
            filas[0].querySelector(".entrada-nombre").value = "";
            filas[0].querySelector(".entrada-cantidad").value = "";
        }
    });

    // 2. Actualiza el ID del platillo activo
    platilloActivoId = id;
    
    // 3. Resalta el botón activo
    actualizarClaseActivoTabs(id);

    // 4. Carga los ingredientes guardados
    const receta = recetasGuardadas[id] || [];
    
    if (receta.length > 0) {
        let inputContador = { 'proteina': 0, 'carb': 0, 'grasas': 0 };

        receta.forEach((item) => {
            const ingredienteData = ingredientesFitness.find(i => i.nombre === item.nombre);
            if (!ingredienteData) return;
            
            const categoria = ingredienteData.cat;
            
            // Usamos el mecanismo de búsqueda de contenedores del alimentos2.js
            let nutrienteContenedor = null;
            const todosNutrientes = document.querySelectorAll('.nutriente');
            
            todosNutrientes.forEach(nutriente => {
                const h3 = nutriente.querySelector('h3');
                if (!h3) return;
                
                const titulo = h3.textContent.toLowerCase();
                
                if (categoria === 'proteina' && titulo.includes('proteína')) {
                    nutrienteContenedor = nutriente;
                } else if (categoria === 'carb' && titulo.includes('carbohidrato')) {
                    nutrienteContenedor = nutriente;
                } else if (categoria === 'grasas' && titulo.includes('grasa')) {
                    nutrienteContenedor = nutriente;
                }
            });


            if (nutrienteContenedor) {
                let filaTarget = null;
                
                if (inputContador[categoria] === 0) {
                    filaTarget = nutrienteContenedor.querySelector(".fila-entrada");
                } else {
                    const filaOriginal = nutrienteContenedor.querySelector(".fila-entrada");
                    filaTarget = filaOriginal.cloneNode(true);
                    
                    filaTarget.querySelector(".entrada-nombre").value = "";
                    filaTarget.querySelector(".entrada-cantidad").value = "";
                    
                    nutrienteContenedor.appendChild(filaTarget);
                }
                
                if (filaTarget) {
                    filaTarget.querySelector(".entrada-nombre").value = item.nombre;
                    filaTarget.querySelector(".entrada-cantidad").value = item.cantidad;
                }
                
                inputContador[categoria]++;
            }
        });
    }

    // 5. Actualiza el total de calorías
    actualizarCaloriasActuales();
}

function actualizarClaseActivoTabs(id) {
    document.querySelectorAll('.platillos .boton-secundario').forEach(div => div.classList.remove('activo'));
    const divActivoPC = document.getElementById(id);
    if (divActivoPC) {
        divActivoPC.classList.add('activo');
    }

    const tabs = document.querySelectorAll('.tabs .tab');
    
    const numeroPlatillo = parseInt(id.replace('BotonPlatillo', ''));
    const indexActivo = numeroPlatillo - 1; 

    tabs.forEach((tab, index) => {
        tab.classList.remove('activo');
        if (index === indexActivo) {
            tab.classList.add('activo');
        }
    });
}

function inicializarCalculoCalorias() {
    const inputOptimo = document.getElementById('InputOptimo');
    const caloriasOptimas = localStorage.getItem('caloriasOptimas');

    if (inputOptimo) {
        inputOptimo.value = caloriasOptimas ? caloriasOptimas + " kcal" : "N/D";
    }

    document.querySelector(".abajo").addEventListener('input', (e) => {
        if (e.target.classList.contains('entrada-cantidad')) {
            actualizarCaloriasActuales();
        }
    });
}

const manejarEliminacion = (fila) => {
    const contenedorNutriente = fila.closest(".nutriente");
    const filasExistentes = contenedorNutriente.querySelectorAll(".fila-entrada");

    if (filasExistentes.length > 1) {
        fila.remove();
    } else {
        fila.querySelector(".entrada-nombre").value = "";
        fila.querySelector(".entrada-cantidad").value = "";
    }
    
    actualizarCaloriasActuales(); 
};

// ----------------------------------------------------
// LÓGICA DE INTERFAZ Y EVENTOS
// ----------------------------------------------------


document.getElementById("FiltroCategoria").addEventListener("change", e => {
    const cat = e.target.value;
    document.querySelectorAll(".ingrediente").forEach(div => {
        console.log(div.dataset.cat, cat);
        div.style.display = (cat === "todos" || div.dataset.cat === cat) ? "block" : "none";
    });
});

document.getElementById("BusquedaIngrediente").addEventListener("input", e => {
    const texto = e.target.value.toLowerCase();
    document.querySelectorAll(".ingrediente").forEach(div => {
        div.style.display = div.textContent.toLowerCase().includes(texto) ? "block" : "none";
    });
});

let ingredienteSeleccionado = null;
let categoriaSeleccionada = null;

document.addEventListener("click", e => {
    if (e.target.classList.contains("ingrediente")) {
        document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
        e.target.classList.add("seleccionado");
        ingredienteSeleccionado = e.target.textContent;
        categoriaSeleccionada = e.target.dataset.cat;
    }
});

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
                
                nuevaFila.querySelector(".entrada-nombre").value = "";
                nuevaFila.querySelector(".entrada-cantidad").value = "";
                
                nutriente.appendChild(nuevaFila);
                inputTarget = nuevaFila.querySelector(".entrada-nombre");
            }

            inputTarget.value = ingredienteSeleccionado;
            inputTarget.closest(".fila-entrada").querySelector(".entrada-cantidad").value = "0";
            
            actualizarCaloriasActuales(); 
        }
    });

    document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
    ingredienteSeleccionado = null;
    categoriaSeleccionada = null;
});

document.getElementById("BotonLimpiar").addEventListener("click", () => {
    document.querySelectorAll(".nutriente").forEach(nutriente => {
        Array.from(nutriente.querySelectorAll(".fila-entrada")).reverse().forEach(fila => {
            manejarEliminacion(fila);
        });
    });
    
    guardarPlatilloActual(); 
});

document.querySelector(".abajo").addEventListener('click', (e) => {
    if (e.target.classList.contains('boton-equis')) {
        manejarEliminacion(e.target.closest(".fila-entrada"));
    }
});

// LÓGICA DE GUARDAR PLATILLO CON NOMBRE (DE alimentos2.js)
document.getElementById("BotonGuardar").addEventListener("click", () => {
    // Verificar que haya al menos un ingrediente
    const hayIngredientes = Array.from(document.querySelectorAll(".fila-entrada")).some(fila => {
        const nombre = fila.querySelector(".entrada-nombre").value;
        const cantidad = fila.querySelector(".entrada-cantidad").value;
        return nombre && cantidad;
    });

    if (!hayIngredientes) {
        alert("No hay ingredientes para guardar. Agrega al menos uno.");
        return;
    }

    // Pedir nombre del platillo
    const nombrePlatillo = prompt("¿Cómo quieres llamar a este platillo?");
    
    if (!nombrePlatillo || nombrePlatillo.trim() === "") {
        alert("Debes ponerle un nombre al platillo.");
        return;
    }

    // Guardar el platillo actual en recetasGuardadas
    guardarPlatilloActual();
    
    // Recopilar datos del platillo para mostrar
    const ingredientesPorCategoria = {
        proteina: [],
        carb: [],
        grasas: []
    };

    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const h3 = nutriente.querySelector("h3").textContent.toLowerCase();
        let categoria = null;
        
        if (h3.includes("proteína")) categoria = "proteina";
        else if (h3.includes("carbohidrato")) categoria = "carb";
        else if (h3.includes("grasa")) categoria = "grasas";

        if (categoria) {
            nutriente.querySelectorAll(".fila-entrada").forEach(fila => {
                const nombre = fila.querySelector(".entrada-nombre").value;
                const cantidad = fila.querySelector(".entrada-cantidad").value;
                if (nombre && cantidad) {
                    ingredientesPorCategoria[categoria].push({ nombre, cantidad });
                }
            });
        }
    });

    // Crear objeto del platillo guardado
    const platilloGuardado = {
        nombre: nombrePlatillo.trim(),
        ingredientes: ingredientesPorCategoria,
        caloriasTotales: document.getElementById("InputActual").value
    };

    // Agregar a la lista (máximo 4)
    if (platillosGuardadosParaMostrar.length >= 4) {
        alert("Ya tienes 4 platillos guardados. Se reemplazará el más antiguo.");
        platillosGuardadosParaMostrar.shift();
    }
    
    platillosGuardadosParaMostrar.push(platilloGuardado);
    
    // Guardar la lista de platillos nombrados para persistencia
    localStorage.setItem('platillosGuardadosParaMostrar', JSON.stringify(platillosGuardadosParaMostrar)); 
    
    // Actualizar la interfaz de abajo
    actualizarPlatillosGuardadosUI();
    
    alert(`¡Platillo "${nombrePlatillo}" guardado correctamente!`);
});


// LÓGICA DE IMPRIMIR CON MENSAJE MOTIVACIONAL (DE alimentos.js)
document.getElementById("BotonImprimir").addEventListener("click", () => {
    // Guarda el platillo actual antes de imprimir
    guardarPlatilloActual(); 
    
    // Frase motivacional de localStorage
    const mensajeMotivacional = localStorage.getItem('mensajeMotivacional') || '¡Sigue así!';
    const actividadLabel = localStorage.getItem('actividadLabel') || '';
    
    // Actualizar el elemento para la frase 
    let fraseElement = document.querySelector('.frase-motivacional-print');
    if (!fraseElement) {
        fraseElement = document.createElement('div');
        fraseElement.className = 'frase-motivacional-print';
        document.querySelector('.izquierda').appendChild(fraseElement);
    }
   
    let textoFrase = '';
    if (actividadLabel) {
        textoFrase += `<strong>${actividadLabel}:</strong> `;
    }
    textoFrase += mensajeMotivacional;
    
    fraseElement.innerHTML = textoFrase;
    

    fraseElement.style.display = 'block';
    fraseElement.style.visibility = 'visible';
    
    const afterPrint = () => {
        // Oculta la frase después de imprimir
        fraseElement.style.display = 'none';
        fraseElement.style.visibility = 'hidden';
        
        window.removeEventListener('afterprint', afterPrint);
    };
    
    window.addEventListener('afterprint', afterPrint);

    window.print();
});


// ----------------------------------------------------
// GESTIÓN DE PLATILLOS GUARDADOS PARA MOSTRAR
// ----------------------------------------------------

function actualizarPlatillosGuardadosUI() {
    const contenedorPlatos = document.querySelectorAll('.platillos-nombres .plato');
    
    contenedorPlatos.forEach((plato, index) => {
        if (platillosGuardadosParaMostrar[index]) {
            const platilloData = platillosGuardadosParaMostrar[index];
            plato.querySelector('p').textContent = platilloData.nombre;
            plato.style.cursor = "pointer";
            plato.style.opacity = "1";
            
            // Agregar evento click para mostrar el detalle
            plato.onclick = () => mostrarDetallePlatillo(platilloData);
        } else {
            plato.querySelector('p').textContent = "Nombre de Platillo";
            plato.style.cursor = "default";
            plato.style.opacity = "0.5";
            plato.onclick = null;
        }
    });
}

function mostrarDetallePlatillo(platillo) {
    let mensaje = `${platillo.nombre}\n`;
    mensaje += `Total: ${platillo.caloriasTotales}\n\n`;
    
    // Proteínas
    if (platillo.ingredientes.proteina.length > 0) {
        mensaje += "Proteínas:\n";
        platillo.ingredientes.proteina.forEach(ing => {
            mensaje += `  • ${ing.nombre}: ${ing.cantidad}g\n`;
        });
        mensaje += "\n";
    }
    
    // Carbohidratos
    if (platillo.ingredientes.carb.length > 0) {
        mensaje += "Carbohidratos:\n";
        platillo.ingredientes.carb.forEach(ing => {
            mensaje += `  • ${ing.nombre}: ${ing.cantidad}g\n`;
        });
        mensaje += "\n";
    }
    
    // Grasas
    if (platillo.ingredientes.grasas.length > 0) {
        mensaje += "Grasas:\n";
        platillo.ingredientes.grasas.forEach(ing => {
            mensaje += `  • ${ing.nombre}: ${ing.cantidad}g\n`;
        });
    }
    
    alert(mensaje);
}

// ----------------------------------------------------
// INICIALIZACIÓN DE PLATILLOS Y ARRANQUE
// ----------------------------------------------------

function inicializarBotonesPlatillos() {
    const elementosNavegacion = document.querySelectorAll('.platillos button, .tabs .tab');

    elementosNavegacion.forEach(elemento => {
        elemento.addEventListener('click', () => {
            let idParaCargar;

            if (elemento.closest('.platillos')) {
                idParaCargar = elemento.closest('.boton-secundario').id;
            } else if (elemento.closest('.tabs')) {
                const tabsContenedor = document.querySelector('.tabs');
                const tabs = Array.from(tabsContenedor.querySelectorAll('.tab'));
                const index = tabs.indexOf(elemento);
                idParaCargar = `BotonPlatillo${index + 1}`;
            }

            if (idParaCargar && idParaCargar !== platilloActivoId) {
                // 1. GUARDA el estado del platillo actual ANTES de cambiar
                guardarPlatilloActual();
                
                // 2. CARGA el nuevo platillo. 
                cargarPlatillo(idParaCargar);
            }
        });
    });

    // Carga inicial
    cargarPlatillo(platilloActivoId);
}


// --- INICIALIZACIÓN FINAL CORREGIDA (Carga segura del DOM) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Definimos 'contenedores' solo cuando el DOM ya está cargado
    contenedores = {
        proteina: document.getElementById("Proteina"),
        carb: document.getElementById("Carbohidratos"),
        grasas: document.getElementById("Grasas")
    };

    // 2. Ejecutamos todas las funciones de inicialización
    //cargarIngredientes();
    cargarIngredientesDelAPI();
    inicializarCalculoCalorias(); 
    inicializarBotonesPlatillos();
    actualizarPlatillosGuardadosUI();

    // 3. Asegura el guardado final antes de recargar
    window.addEventListener('beforeunload', () => {
        guardarPlatilloActual();
    });
});
