// --- 1. VARIABLES GLOBALES (Del script original) ---
let recetasGuardadas = {
    'BotonPlatillo1': [], 
    'BotonPlatillo2': [],
    'BotonPlatillo3': [],
    'BotonPlatillo4': [],
    'BotonPlatillo5': []
};
let platilloActivoId = 'BotonPlatillo1';
let platillosGuardadosParaMostrar = []; 
const modalGuardar = document.querySelector('.contenido');
const btnGuardarNombre = document.getElementById('btnGuardar');


// --------------------------------------------------------------------------------------
// 2. FUNCIÓN DE RECOPILACIÓN (Mínima y Reutilizable)
// --------------------------------------------------------------------------------------

function recopilarIngredientes() {
    const ingredientesPlatillo = [];

    document.querySelectorAll(".fila-entrada").forEach(fila => {
        const nombre = fila.querySelector(".entrada-nombre").value.trim();
        const cantidad = fila.querySelector(".entrada-cantidad").value.trim();
        
        // Solo guarda si ambos campos tienen valor
        if (nombre !== '' && cantidad !== '') {
            ingredientesPlatillo.push({
                nombre: nombre,
                cantidad: cantidad 
            });
        }
    });
    return ingredientesPlatillo;
}


// --------------------------------------------------------------------------------------
// 3. FUNCIÓN DE GUARDADO (Actualiza el diccionario)
// --------------------------------------------------------------------------------------

function guardarPlatilloActual() {
    // 1. Recopila los datos del DOM actual
    const ingredientesPlatillo = recopilarIngredientes(); 
    
    // 2. **ACCIÓN CLAVE:** Guarda o Sobreescribe el platillo activo en el diccionario.
    recetasGuardadas[platilloActivoId] = ingredientesPlatillo;
    
    console.log(`Platillo "${platilloActivoId}" actualizado en recetasGuardadas.`);
}


// --------------------------------------------------------------------------------------
// 4. FUNCIÓN DE CARGA (Limpia DOM, Carga de diccionario y Estilo)
// --------------------------------------------------------------------------------------

function limpiarFormulario() {
    // Limpieza agresiva: busca todos los campos de nombre y cantidad
    document.querySelectorAll(".entrada-nombre").forEach(input => input.value = "");
    document.querySelectorAll(".entrada-cantidad").forEach(input => input.value = "");
    
    // (Opcional): Limpia las etiquetas de macros y elimina filas extra.
    // Para la versión más simple, asumimos que solo limpiamos las 3 filas principales.
    document.querySelectorAll(".etiqueta-macros").forEach(label => label.textContent = "macros p/c 100g []");
}

function cargarPlatillo(id) {
    // 1. Limpia el formulario actual
    limpiarFormulario();

    // 2. Actualiza el ID activo y el estilo visual
    platilloActivoId = id;
    // Asume que esta función (que es simple) está definida
    // 
    actualizarClaseActivoTabs(id); 
    
    // 3. Obtiene los ingredientes del diccionario para el nuevo platillo
    const receta = recetasGuardadas[id] || [];
    
    // 4. Muestra SOLO el primer ingrediente en el PRIMER campo de entrada (la clave de la corrección)
    if (receta.length > 0) {
        // Obtenemos el primer ingrediente guardado
        //const primerIngrediente = receta[0];
        
        // Usamos querySelector para garantizar que solo obtenemos el primer elemento encontrado
        /*const primerNombreInput = document.querySelector(".entrada-nombre");
        const primerCantidadInput = document.querySelector(".entrada-cantidad");
        
        if (primerNombreInput && primerCantidadInput) {
            primerNombreInput.value = primerIngrediente.nombre;
            primerCantidadInput.value = primerIngrediente.cantidad;
        }*/
        const nombresInputs = document.querySelectorAll(".entrada-nombre");
        const cantidadInputs = document.querySelectorAll(".entrada-cantidad");
        receta.forEach((ingrediente, index) => {
            if (nombresInputs[index] && cantidadInputs[index]) {
                nombresInputs[index].value = ingrediente.nombre;
                cantidadInputs[index].value = ingrediente.cantidad;
            }
        });
    }
    
    console.log(`Cargado Platillo "${id}".`);
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

// --------------------------------------------------------------------------------------
// 5. INICIALIZACIÓN DE BOTONES (Garantiza el Guardar/Cargar al cambiar)
// --------------------------------------------------------------------------------------

function inicializarManejoPlatillos() {
    const elementosNavegacion = document.querySelectorAll('.platillos button, .tabs .tab');

    elementosNavegacion.forEach(elemento => {
        elemento.addEventListener('click', () => {
            // (La lógica para obtener idParaCargar se mantiene de tu script original)
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
                guardarPlatilloActual(); // Guarda el viejo platillo
                cargarPlatillo(idParaCargar); // Carga el nuevo platillo
            }
        });
    });

    // Carga inicial
    cargarPlatillo(platilloActivoId); 
}


function generarHTMLPlatillosParaImprimir(platillos) {
    let html = '<h2>Plan Nutricional</h2>';
    
    // Simplificación de la lógica de la frase motivacional
    const mensajeMotivacional = '¡Tu esfuerzo de planificación garantiza tu éxito!'; 
    
    // Estructura de la frase motivacional (similar a tu ejemplo)
    html += `<div class="frase-motivacional-print">
                <strong>Plan de comidas:</strong> ${mensajeMotivacional}
            </div>`;

    platillos.forEach((platillo, index) => {
        html += `<div class="platillo-imprimible">`;
        html += `<h3>Platillo ${index + 1}: ${platillo.nombre}</h3>`;
        
        if (platillo.ingredientes && platillo.ingredientes.length > 0) {
            html += `<ul class="lista-ingredientes">`;
            platillo.ingredientes.forEach(ingrediente => {
                // Usamos el formato "Nombre: Cantidad g"
                html += `<li>${ingrediente.nombre}: ${ingrediente.cantidad} g</li>`;
            });
            html += `</ul>`;
        } else {
            html += `<p>Este platillo fue guardado sin ingredientes.</p>`;
        }
        html += `</div>`;
    });
    
    return html;
}

/**
 * Prepara el DOM para la impresión, inyecta el contenido y llama a window.print().
 */
function prepararEImprimirPlatillosConDiccionario() {
    guardarPlatilloActual(); 

    // 2. FILTRAR PLATILLOS ACTIVOS: Tomamos todos los 5 pares [ID, Array de Ingredientes] 
    //    y mantenemos solo aquellos cuyo array de ingredientes NO está vacío.
    const platillosActivos = Object.entries(recetasGuardadas).filter(
        ([id, ingredientes]) => ingredientes.length > 0
    );

    if (platillosActivos.length === 0) {
        alert('No hay platillos con ingredientes guardados para imprimir. Por favor, agrega y guarda al menos un ingrediente en Platillo 1-5.');
        return;
    }

    // --- Generación del Contenido HTML ---
    let htmlContent = '<h2>Resumen de Platos del Día</h2>';
    const mensajeMotivacional = '¡Tu planeación nutricional es clave para el éxito!'; 
    
    htmlContent += `<div class="frase-motivacional-print">
                        <strong>Plan de comidas:</strong> ${mensajeMotivacional}
                    </div>`;


    // 3. ITERACIÓN SOBRE TODOS LOS PLATILLOS NO VACÍOS
    // El forEach aquí itera sobre los resultados filtrados, que son todos los platillos con contenido.
    platillosActivos.forEach(([id, ingredientes]) => {
        // Formato el ID para que sea más legible (ej: 'BotonPlatillo1' -> 'Platillo 1')
        const nombrePlatillo = id.replace('Boton', ' ').replace('Platillo', '');
        
        htmlContent += `<div class="platillo-imprimible">`;
        htmlContent += `<h3>${nombrePlatillo}</h3>`;
        
        if (ingredientes.length > 0) {
            htmlContent += `<ul class="lista-ingredientes">`;
            ingredientes.forEach(ingrediente => {
                htmlContent += `<li>${ingrediente.nombre}: ${ingrediente.cantidad} g</li>`;
            });
            htmlContent += `</ul>`;
        }
        htmlContent += `</div>`;
    });

    // 4. Inyección y Llamada a Impresión (Mismo proceso de limpieza)
    let printContainer = document.getElementById('ContenidoImprimible');
    if (!printContainer) {
        printContainer = document.createElement('div');
        printContainer.id = 'ContenidoImprimible';
        document.body.appendChild(printContainer); 
    }

    printContainer.innerHTML = htmlContent;

    const afterPrint = () => {
        printContainer.innerHTML = ''; 
        window.removeEventListener('afterprint', afterPrint);
    };

    window.addEventListener('afterprint', afterPrint);

    window.print();
}

// --------------------------------------------------------------------------------------
// Funciones del API
// --------------------------------------------------------------------------------------


function cargarIngredientesDelAPI(){
    (async () => {
    const response = await apiGetIngredientes();
    //console.log("Ingredientes desde API:", response);

    response.forEach(i => {
        const kcal_por_gramo = ((i.proteinaG * 4) + (i.carbosG * 4) + (i.grasasG * 9)) / 100;
        let t;
        if (i.tipo === "proteína") t = "proteina";
        else if (i.tipo === "carbohidrato") t = "carb";
        else if (i.tipo === "grasa") t = "grasas";
        else t = t.tipo;
        //console.log({ nombre: i.nombre, cat: t, kcal_por_gramo });

        ingredientesFitness.push({
            ingredienteId: i.ingredienteId,
            nombre: i.nombre,
            cat: t,
            kcal_por_gramo,
            proteinaG: i.proteinaG,
            carbosG: i.carbosG,
            grasasG: i.grasasG
        });
        console.log(i);
    });
    })();
}

function cargarPlatillosDelApi(){
    
    (async () => {
    const response = await apiGetPlatillos();
    console.log("Platillos desde API:", response);

    response.forEach(i => {
        platillosGuardadosParaMostrar.push({
            nombre: i.nombre,
            kCalTotal: i.kCalTotal,
            platilloIngredientes: i.platilloIngredientes
        });
    });

    platillosGuardadosParaMostrar.forEach((platillo, index) => {
        console.log(`Platillo ${index + 1}:`, platillo);
    });

    actualizarPlatillosGuardadosUI();
    })();
}
    
// --------------------------------------------------------------------------------------
// 6. MANEJO DE BOTONES DE ACCIÓN (Simple)
// --------------------------------------------------------------------------------------

// Lógica del Botón Limpiar
document.getElementById("BotonLimpiar").addEventListener("click", () => {
    limpiarFormulario();
    guardarPlatilloActual(); // Guarda el platillo activo como vacío
    alert("Platillo limpiado.");
});

document.getElementById("BotonGuardar").addEventListener("click", () => {
   guardarPlatilloActual(); 

    if(recetasGuardadas[platilloActivoId].length === 0){
        alert("No hay ingredientes para guardar en este platillo. Por favor, agrega al menos un ingrediente.");
        return;
    }

    if (modalGuardar) {
        modalGuardar.style.display = 'block';
    }

    document.body.style.overflow = 'hidden';
});

// Lógica del Botón Imprimir (Simple placeholder)
document.getElementById("BotonImprimir").addEventListener("click", () => {
    //guardarPlatilloActual(); // Asegura el guardado
    //const platilloGuardado = recetasGuardadas[platilloActivoId];
    //alert(`Preparado para imprimir Platillo ${platilloActivoId} con ${platilloGuardado.length} ingredientes.`);
    // window.print(); // Descomentar al implementar
    prepararEImprimirPlatillosConDiccionario();
});

document.querySelectorAll('.boton-equis').forEach(boton => {
    boton.addEventListener('click', (e) => {
        const fila = boton.closest('.fila-entrada');
        if (!fila) return;
        const nombreInput = fila.querySelector('.entrada-nombre');
        if (!nombreInput) return;

        // Cambia el valor al que necesites; por ahora usamos "Pollo Asado"
        nombreInput.value = 'Pollo Asado';

        console.log('Entrada actualizada a "Pollo Asado" en la fila correspondiente');
    });
});

btnGuardarNombre.addEventListener("click", () => {
    // 1. Obtener el nombre del platillo
    const nombreInput = modalGuardar.querySelector('.nombre');
    const nombrePlatillo = nombreInput.value.trim();

    if (nombrePlatillo) {
        // 2. Usar los datos ya guardados en recetasGuardadas[platilloActivoId]
        const datosPlatillo = {
            nombre: nombrePlatillo,
            ingredientes: recetasGuardadas[platilloActivoId]
        };
        platillosGuardadosParaMostrar.push(datosPlatillo);
        
        console.log(`Guardado final: "${nombrePlatillo}" añadido al array.`);
        
        // 3. Limpiar y ocultar el modal
        nombreInput.value = ''; // Limpiar el campo
        modalGuardar.style.display = 'none';
        document.body.style.overflow = 'auto'; // Habilitar el scroll
    } else {
        alert("Por favor, ingresa un nombre para el platillo.");
    }
});
// --------------------------------------------------------------------------------------
// 7. INICIALIZACIÓN DEL ARRANQUE
// --------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    inicializarManejoPlatillos();
    cargarIngredientesDelAPI();
    cargarPlatillosDelApi();
});