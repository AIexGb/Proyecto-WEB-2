// --- 1. VARIABLES GLOBALES (Del script original) ---
let recetasGuardadas = {
    'BotonPlatillo1': [], 
    'BotonPlatillo2': [],
    'BotonPlatillo3': [],
    'BotonPlatillo4': [],
    'BotonPlatillo5': []
};

let platilloActivoId = 'BotonPlatillo1';
let AguaRecomendada = localStorage.getItem("aguaRecomendada") || 0;
const mensajeGlobal = localStorage.getItem('mensajeMotivacional') || '¡Sigue adelante con tu plan nutricional!';
const actividadGlobal = localStorage.getItem('actividadLabel') || 'Plan personalizado';

let CaloriasOptimas = localStorage.getItem("caloriasOptimas") || 0;
let platillosGuardadosParaMostrar = []; 
let ingredientesFitness = [];
let ingredientesTotales = [];
let contenedores = {}; 
let caloriasMap = {};
let mensajeMotivacional
let actividadLabel
let ingredienteSeleccionado = {
    nombre: '',
    cat: '',
    kcal_por_gramo: 0
};

const modalGuardar = document.querySelector('.contenido');
const btnGuardarNombre = document.getElementById('btnGuardar');
const btnCancelarNombre = document.getElementById('btnCerrar');


// --------------------------------------------------------------------------------------
// 2. FUNCIÓN DE RECOPILACIÓN (Mínima y Reutilizable)
// --------------------------------------------------------------------------------------

function recopilarIngredientes() {
    let ingredientesPlatillo = [];

    document.querySelectorAll(".nutriente").forEach(nutriente => {
        nutriente.querySelectorAll(".fila-entrada").forEach(fila => {
            const nombre = fila.querySelector(".entrada-nombre").value.trim();
            const cantidad = fila.querySelector(".entrada-cantidad").value.trim();
            const categoria = nutriente.querySelector("h3").textContent.toLowerCase();
            
            // Solo guarda si ambos campos tienen valor
            if (nombre !== '' && cantidad !== '' && !isNaN(cantidad) && Number(cantidad) > 0) {
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


// --------------------------------------------------------------------------------------
// 3. FUNCIÓN DE GUARDADO (Actualiza el diccionario)
// --------------------------------------------------------------------------------------

function guardarPlatilloActual() {
    // 1. Recopila los datos del DOM actual
    const ingredientesPlatillo = recopilarIngredientes(); 
    
    // 2. **ACCIÓN CLAVE:** Guarda o Sobreescribe el platillo activo en el diccionario.
    recetasGuardadas[platilloActivoId] = ingredientesPlatillo;
    
    
}


// --------------------------------------------------------------------------------------
// 4. FUNCIÓN DE CARGA (Limpia DOM, Carga de diccionario y Estilo)
// --------------------------------------------------------------------------------------

function cargarIngredientesDelPlatillo(platillo) {
    var btnLimpiar = document.getElementById("BotonLimpiar");
    btnLimpiar.click(); // Simula clic en Limpiar para reiniciar

    var ing = [];
    ingredientesFitness.forEach(i => {
        platillo.platilloIngredientes.forEach(platilloIng => {
            if (platilloIng.ingredienteNombre === i.nombre) {
                ing.push({
                    ingredienteId: i.ingredienteId,
                    nombre: platilloIng.ingredienteNombre,
                    cat: i.cat,
                    cantidad: platilloIng.cantidad,
                    proteinaG: i.proteinaG,
                    carbosG: i.carbosG,
                    grasasG: i.grasasG
                });
            }
        });
    });

    cargarIngredientesAlDom(ing);

    Array.from(document.getElementsByClassName("entrada-cantidad"))
        .forEach(input => {
            input.addEventListener("input", e => {
            
            e.target.value = e.target.value.replace(/\D/g, '');
            
        });
    });
    
}


function actualizarPlatillosGuardadosUI() {
    const contenedorPlatos = document.querySelectorAll('.platillos-nombres .plato');
    let papa = document.querySelector('.platillos-nombres');
    platillosGuardadosParaMostrar.forEach((platillo) => {
        var nuevoDiv = document.createElement("div");
        nuevoDiv.classList.add("plato");
        nuevoDiv.innerHTML = `<p>${platillo.nombre}</p>`;
        nuevoDiv.style.cursor = "pointer";
        nuevoDiv.style.opacity = "1";
        nuevoDiv.onclick = () => cargarIngredientesDelPlatillo(platillo);
        papa.appendChild(nuevoDiv);
    });
}

function actualizarCaloriasActuales() {
    // Siempre reinicia totales dentro de la función
    let caloriasTotales = 0;
    kcalTot = 0;
    let proTot = 0;
    let carbTot = 0;
    let grasTot = 0;

    // 1) Filas actuales
    
        document.querySelectorAll(".fila-entrada").forEach(fila => {
            const nombre = fila.querySelector(".entrada-nombre").value.trim();
            const cantidadGramos = parseFloat(fila.querySelector(".entrada-cantidad").value) || 0;

            if (!nombre || cantidadGramos <= 0) return;

            // Calorías
            if (caloriasMap[nombre]) {
                caloriasTotales += caloriasMap[nombre] * cantidadGramos;
            }

            // Macros
            const datos = ingredientesFitness.find(i => i.nombre === nombre);
            if (datos) {
                const factor = cantidadGramos / 100; // porque tus macros están por 100g
                proTot  += (Number(datos.proteinaG) || 0) * factor;
                carbTot += (Number(datos.carbosG)   || 0) * factor;
                grasTot += (Number(datos.grasasG)   || 0) * factor;
            }
        });

    // 2) Recetas guardadas (si quieres que también cuenten)
    for (let i = 1; i <= 5; i++) {
        const platillo = recetasGuardadas[`BotonPlatillo${i}`] || [];
        if(`BotonPlatillo${i}` !== platilloActivoId){
            platillo.forEach(ingrediente => {
                const nombre = ingrediente.nombre;
                const cantidad = parseFloat(ingrediente.cantidad) || 0;
                if (!nombre || cantidad <= 0) return;

                const datos = ingredientesFitness.find(it => it.nombre === nombre);
                if (datos) {
                    const factor = cantidad / 100;
                    proTot  += (Number(datos.proteinaG) || 0) * factor;
                    carbTot += (Number(datos.carbosG)   || 0) * factor;
                    grasTot += (Number(datos.grasasG)   || 0) * factor;
                }
            });
        }
        
    }
    kCalTotal = (proTot * 4) + (carbTot * 4) + (grasTot * 9);

    

    // 3) Reflejar en inputs
    document.getElementById("InputActual").value            = Math.round(caloriasTotales) + "kcal";
    document.getElementById("InputProteinasTotales").value  = Math.round(proTot);
    document.getElementById("InputCarbosTotales").value     = Math.round(carbTot);
    document.getElementById("InputGrasasTotales").value     = Math.round(grasTot);
    document.getElementById("InputKcalTotales").value      = Math.round(kCalTotal) + "kcal";
}


function actualizarCaloriasActualesCambioPlatillo(id) {
    let caloriasTotales = 0;
    
    const receta = recetasGuardadas[id] || [];
    
    receta.forEach(ingrediente => {
        const nombre = ingrediente.nombre;
        const cantidadGramos = parseInt(ingrediente.cantidad) || 0;
        if (nombre && caloriasMap[nombre]) {
            caloriasTotales += caloriasMap[nombre] * cantidadGramos;
        }
    });
    document.getElementById("InputActual").value = Math.round(caloriasTotales) + " kcal";
}

function limpiarFormulario() {
    // Limpieza agresiva: busca todos los campos de nombre y cantidad
    let nutriente = Array.from(document.querySelectorAll(".nutriente"))
    

    nutriente.forEach((nutri, idx) => {
    let fila = nutri.querySelectorAll(".fila-entrada");
    

    fila.forEach(f => {
        const itemsAEliminar = Array.from(f.querySelectorAll(".entrada-nombre")).map((input, i) => {
            const cantidad = f.querySelectorAll(".entrada-cantidad")[i].value;
            return {
                nombre: input.value,
                cantidad: cantidad
            };
        });

        ingredientesTotales = ingredientesTotales.filter(ing =>
            !itemsAEliminar.some(item =>
                item.nombre === ing.nombre && item.cantidad == ing.cantidad
            )
        );

        f.querySelectorAll(".entrada-nombre").forEach(input => input.value = "");
        f.querySelectorAll(".entrada-cantidad").forEach(input => input.value = "");
    });


    fila.forEach((f, i) => {
        if (i > 0) f.remove();
    });
});
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
       cargarIngredientesAlDom(receta);
    }
        
    
    
}


function cargarIngredientesAlDom(array) {
    // Resetear ingredientesTotales antes de poblar, evitar acumulaciones entre cargas
    ingredientesTotales = [];
    array.forEach((ingrediente) => {
        document.querySelectorAll(".nutriente").forEach(nutriente => {
            const h3 = nutriente.querySelector("h3").textContent.toLowerCase();

            const categorias =
                (ingrediente.cat === "proteina" && h3.includes("proteína")) ||
                (ingrediente.cat === "carb" && h3.includes("carbohidrato")) ||
                (ingrediente.cat === "grasas" && h3.includes("grasa"));

            if (!categorias) return;

            let inputTarget = Array.from(nutriente.querySelectorAll(".entrada-nombre"))
                .find(input => input.value === "");

            if (inputTarget) {
                const fila = inputTarget.closest(".fila-entrada");
                fila.querySelector(".entrada-nombre").value = ingrediente.nombre;
                const cantidadInput = fila.querySelector(".entrada-cantidad");
                cantidadInput.value = ingrediente.cantidad;
                // Disparar 'input' para que los listeners reaccionen igual que si el usuario tipeara
                cantidadInput.dispatchEvent(new Event('input', { bubbles: true }));

            } else {
                const filaOriginal = nutriente.querySelector(".fila-entrada:last-of-type");
                const nuevaFila = filaOriginal.cloneNode(true);

                nuevaFila.querySelector(".entrada-nombre").value = ingrediente.nombre;
                const nuevaCantidadInput = nuevaFila.querySelector(".entrada-cantidad");
                nuevaCantidadInput.value = ingrediente.cantidad;
                nutriente.appendChild(nuevaFila);
                // Disparar 'input' en la nueva fila para activar delegados
                nuevaCantidadInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        //ingredientesTotales.push(ingrediente);
    });
    // Después de insertar/actualizar valores por código, asegurarnos de recalcular
    // las calorías y actualizar los contadores en la UI.
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
    
    actualizarCaloriasActualesCambioPlatillo(id);
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
    
    actualizarCaloriasActuales();
    // Carga inicial
    cargarPlatillo(platilloActivoId); 
}



function prepararEImprimirPlatillosConDiccionario() {
    guardarPlatilloActual(); 

    const platillosActivos = Object.entries(recetasGuardadas).filter(
        ([id, ingredientes]) => ingredientes.length > 0
    );

    const mensajeMotivacional = mensajeGlobal;
    const actividadLabel = actividadGlobal;

    const caloriasOptimas = document.getElementById("InputOptimo").value || "0 kcal";
    const caloriasOptimasPP = document.getElementById("InputOptimoPP").value || "0 kcal";
    const caloriasActual = document.getElementById("InputActual").value || "0 kcal";
    const kcalTotales = document.getElementById("InputKcalTotales").value || "0 kcal";
    const proteinasTotales = document.getElementById("InputProteinasTotales").value || "0";
    const grasasTotales = document.getElementById("InputGrasasTotales").value || "0";
    const carbosTotales = document.getElementById("InputCarbosTotales").value || "0";
    const aguaDiaria = document.getElementById("InputAgua").value || "0 litros";

    let htmlContent = `
        <div style="max-width: 900px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
            <h1 style="text-align: center; color: #802b4a; margin-bottom: 10px; font-size: 28px; font-weight: bold;">Plan Nutricional del Día</h1>
            
            <div style="background: #e62e6b; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <p style="font-size: 16px; margin: 0; font-style: italic;">${mensajeMotivacional}</p>
            </div>

            <div style="background: #f8eaf4; padding: 15px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #e62e6b;">
                <p style="margin: 0; font-size: 14px; color: #802b4a;"><strong>Nivel de Actividad:</strong> ${actividadLabel}</p>
            </div>
    `;

    platillosActivos.forEach(([id, ingredientes]) => {
        const nombrePlatillo = id.replace('Boton', '').replace('Platillo', 'Platillo ');
        
        htmlContent += `
            <div style="background: white; border: 2px solid #e62e6b; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #e62e6b; margin-top: 0; border-bottom: 3px solid #e62e6b; padding-bottom: 10px; font-size: 20px;">${nombrePlatillo}</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <thead>
                        <tr style="background: #f8eaf4;">
                            <th style="border: 1px solid #e62e6b; padding: 12px; text-align: left; color: #802b4a; font-weight: bold;">Ingrediente</th>
                            <th style="border: 1px solid #e62e6b; padding: 12px; text-align: center; color: #802b4a; font-weight: bold;">Cantidad (g)</th>
                            <th style="border: 1px solid #e62e6b; padding: 12px; text-align: center; color: #802b4a; font-weight: bold;">Macros</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        ingredientes.forEach(ingrediente => {
            const datosIngrediente = ingredientesFitness.find(i => i.nombre === ingrediente.nombre);
            let macrosText = "N/A";
            
            if (datosIngrediente) {
                const cantidad = parseFloat(ingrediente.cantidad) || 0;
                const factor = cantidad / 100;
                const proteina = Math.round((datosIngrediente.proteinaG || 0) * factor);
                const carbos = Math.round((datosIngrediente.carbosG || 0) * factor);
                const grasas = Math.round((datosIngrediente.grasasG || 0) * factor);
                const kcal = Math.round(datosIngrediente.kcal_por_gramo * cantidad);
                
                macrosText = `P: ${proteina}g | C: ${carbos}g | G: ${grasas}g | Kcal: ${kcal}`;
            }
            
            htmlContent += `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 10px; color: #333;">${ingrediente.nombre}</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #333;">${ingrediente.cantidad}</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #555; font-size: 12px;">${macrosText}</td>
                        </tr>
            `;
        });

        htmlContent += `
                    </tbody>
                </table>
            </div>
        `;
    });

    htmlContent += `
        <br>
        <div style="page-break-before: always; background: #f8eaf4; border-radius: 8px; padding: 20px; margin-top: 30px;">
            <h3 style="color: #802b4a; margin-top: 0; border-bottom: 2px solid #e62e6b; padding-bottom: 10px; font-size: 18px;">Resumen Nutricional</h3>
            <br>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #e62e6b;">
                    <p style="margin: 5px 0; color: #802b4a; font-weight: bold;">Calorías Óptimas (KCal):</p>
                    <p style="margin: 5px 0; color: #333; font-size: 16px;">${caloriasOptimas}</p>
                </div>
                
                <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #e62e6b;">
                    <p style="margin: 5px 0; color: #802b4a; font-weight: bold;">Calorías Óptimas por Platillo (KCal):</p>
                    <p style="margin: 5px 0; color: #333; font-size: 16px;">${caloriasOptimasPP}</p>
                </div>
                
                <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #e62e6b;">
                    <p style="margin: 5px 0; color: #802b4a; font-weight: bold;">Calorías Actuales (KCal):</p>
                    <p style="margin: 5px 0; color: #333; font-size: 16px;">${caloriasActual}</p>
                </div>
                
                <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #e62e6b;">
                    <p style="margin: 5px 0; color: #802b4a; font-weight: bold;">KCal Totales:</p>
                    <p style="margin: 5px 0; color: #333; font-size: 16px;">${kcalTotales}</p>
                </div>
                
                <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #e62e6b;">
                    <p style="margin: 5px 0; color: #802b4a; font-weight: bold;">Proteínas Totales:</p>
                    <p style="margin: 5px 0; color: #333; font-size: 16px;">${proteinasTotales}g</p>
                </div>
                
                <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #e62e6b;">
                    <p style="margin: 5px 0; color: #802b4a; font-weight: bold;">Carbohidratos Totales:</p>
                    <p style="margin: 5px 0; color: #333; font-size: 16px;">${carbosTotales}g</p>
                </div>
                
                <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #e62e6b;">
                    <p style="margin: 5px 0; color: #802b4a; font-weight: bold;">Grasas Totales:</p>
                    <p style="margin: 5px 0; color: #333; font-size: 16px;">${grasasTotales}g</p>
                </div>
                
                <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #e62e6b;">
                    <p style="margin: 5px 0; color: #802b4a; font-weight: bold;">Agua (Diaria):</p>
                    <p style="margin: 5px 0; color: #333; font-size: 16px;">${aguaDiaria}</p>
                </div>
            </div>
        </div>
        
        </div>
    `;

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

    response.forEach(i => {
        const kcal_por_gramo = ((i.proteinaG * 4) + (i.carbosG * 4) + (i.grasasG * 9)) / 100;
        let t;
        if (i.tipo === "proteína") t = "proteina";
        else if (i.tipo === "carbohidrato") t = "carb";
        else if (i.tipo === "grasa") t = "grasas";
        else t = t.tipo;
        

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

function guardadoDePlatillosEnApi(nombrePlatillo) {
     let ingredientesPorCategoria = [];

    document.querySelectorAll(".fila-entrada").forEach(fila => {
        const nombre = fila.querySelector(".entrada-nombre").value;
        const cantidad = fila.querySelector(".entrada-cantidad").value;
        if (nombre && cantidad) {
            var id = ingredientesFitness.find(i=>i.nombre === nombre).ingredienteId
            ingredientesPorCategoria.push({ ingredienteId:id, Cantidad:cantidad });
        }
    });
    

    // Crear objeto del platillo guardado
        var Nombre= nombrePlatillo.trim();
        var ingredientes= ingredientesPorCategoria;
        
    
    (async () => {
        var response = await apiPostPlatillo(Nombre, ingredientes);
        if (response.message === "Platillo created successfully") {
            alert("Platillo guardado exitosamente en el servidor.");
            cargarPlatillosDelApi();
            return true;
        } else {
            alert("Error al guardar el platillo en el servidor.");
            return false;
        }
    })();
}
// --------------------------------------------------------------------------------------
// 6. MANEJO DE BOTONES DE ACCIÓN (Simple)
// --------------------------------------------------------------------------------------

// Lógica del Botón Limpiar
document.getElementById("BotonLimpiar").addEventListener("click", () => {
    limpiarFormulario();
    actualizarCaloriasActuales();
    guardarPlatilloActual(); // Guarda el platillo activo como vacío
});

document.getElementById("BotonGuardar").addEventListener("click", () => {
   guardarPlatilloActual(); 

    if(recetasGuardadas[platilloActivoId].length === 0){
        alert("No hay ingredientes para guardar en este platillo. Por favor, agrega al menos un ingrediente.");
        return;
    }

    if (modalGuardar) {
        modalGuardar.style.display = 'block';
        document.querySelector('#nombrePlatilloDB').focus();
    }

    document.body.style.overflow = 'hidden';
});

document.getElementById("btnGuardar").addEventListener("click", () => {
    const nombreP = modalGuardar.querySelector('.nombre').value.trim();
    
    if (guardadoDePlatillosEnApi(nombreP)) {
        modalGuardar.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

});

// Lógica del Botón Imprimir (Simple placeholder)
document.getElementById("BotonImprimir").addEventListener("click", () => {
    //guardarPlatilloActual(); // Asegura el guardado
    //const platilloGuardado = recetasGuardadas[platilloActivoId];
    // window.print(); // Descomentar al implementar
    prepararEImprimirPlatillosConDiccionario();
});

/*document.querySelectorAll('.boton-equis').forEach(boton => {
    boton.addEventListener('click', (e) => {
        /*const fila = boton.closest('.fila-entrada');
        if (!fila) return;
        const nombreInput = fila.querySelector('.entrada-nombre');
        if (!nombreInput) return;

        // Cambia el valor al que necesites; por ahora usamos "Pollo Asado"
        /*nombreInput.value = 'Pollo Asado';

        
        
        if (e.target.classList.contains('boton-equis')) {
        const fila = e.target.closest('.fila-entrada');
            if (fila) {
                fila.remove();
                actualizarCaloriasActuales();
            }
        }

        // Recalcular totales después de agregar programáticamente el ingrediente
        

    });
});*/

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('boton-equis')) {
        const fila = e.target.closest('.fila-entrada');
        if (!fila) return;
        
        // Busca el contenedor padre (puede ser .nutriente o el contenedor general)
        const contenedor = fila.closest('.nutriente') || fila.parentElement;
        if (!contenedor) return;
        
        const totalFilas = contenedor.querySelectorAll('.fila-entrada').length;
        
        if (totalFilas === 1) {
            // Si es la única fila, solo limpia los valores
            fila.querySelector('.entrada-nombre').value = '';
            fila.querySelector('.entrada-cantidad').value = '';
        } else {
            // Si hay más filas, elimina todo el div
            fila.remove();
        }
        
        actualizarCaloriasActuales();
    }
});

btnCancelarNombre.addEventListener("click", () => {
    const nombreInput = modalGuardar.querySelector('.nombre');
    nombreInput.value = '';
    modalGuardar.style.display = 'none';
    document.body.style.overflow = 'auto';
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
        
        
        
        // 3. Limpiar y ocultar el modal
        nombreInput.value = ''; // Limpiar el campo
        modalGuardar.style.display = 'none';
        document.body.style.overflow = 'auto'; // Habilitar el scroll
    } else {
        alert("Por favor, ingresa un nombre para el platillo.");
    }
});

// obtener ingrediente de lista
document.addEventListener("click", e => {
    if (e.target.classList.contains("ingrediente")) {
        document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
        e.target.classList.add("seleccionado");
        ingredienteSeleccionado = e.target.textContent;
        categoriaSeleccionada = e.target.dataset.cat;
        ingredienteSeleccionado = {
            nombre: e.target.textContent,
            cat: e.target.dataset.cat,
            kcal_por_gramo: ingredientesFitness.find(i => i.nombre === e.target.textContent).kcal_por_gramo
        }
    }
});

//Filtro de categorias
document.getElementById('FiltroCategoria').addEventListener('change', (e) => {
    const categoria = e.target.value; // 'proteina', 'carb', o 'grasas'

    document.querySelectorAll(".ingrediente").forEach(div => {
        if (categoria === 'todos' || div.dataset.cat === categoria) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
     }
    });
});

// actualizacion de calorias por inputs (delegación para cubrir filas dinámicas)
document.addEventListener('input', (e) => {
    if (!e.target) return;
    const target = e.target;
    if (target.classList && target.classList.contains('entrada-cantidad')) {
        
        actualizarCaloriasActuales();
        
    }
});

//buscador de ingredientes
document.getElementById("BusquedaIngrediente").addEventListener('input', () => {
    const valor = document.getElementById("BusquedaIngrediente").value.toLowerCase();
    document.querySelectorAll('.ingrediente').forEach(i => {
        i.style.display = i.textContent.toLowerCase().includes(valor) ? "block" : "none";
    });
});

document.getElementById("BusquedaPlatillo").addEventListener('input', () => {
    const valor = document.getElementById("BusquedaPlatillo").value.toLowerCase();
    document.querySelectorAll('.plato').forEach(i => {
        i.style.display = i.textContent.toLowerCase().includes(valor) ? "block" : "none";
    });
});

//cargar ingrediente de la lista
document.querySelector("#botonAgregar").addEventListener("click", () => {
    if (!ingredienteSeleccionado || !categoriaSeleccionada) return alert("Selecciona primero un ingrediente.");

    document.querySelectorAll(".nutriente").forEach(nutriente => {
        const h3 = nutriente.querySelector("h3")?.textContent.toLowerCase();
        if (!h3) return;

        if ((categoriaSeleccionada === "proteina" && h3.includes("proteína")) ||
            (categoriaSeleccionada === "carb" && h3.includes("carbohidrato")) ||
            (categoriaSeleccionada === "grasas" && h3.includes("grasa"))) {
            
            let inputDuplicado = Array.from(nutriente.querySelectorAll(".entrada-nombre")).find(input => input.value === ingredienteSeleccionado.nombre);
            if (inputDuplicado) {
                return alert("El ingrediente ya ha sido agregado en este platillo.");
            }
            
            let inputTarget = Array.from(nutriente.querySelectorAll(".entrada-nombre")).find(input => input.value === "");

            if (!inputTarget) {
                const filaOriginal = nutriente.querySelector(".fila-entrada");
                const nuevaFila = filaOriginal.cloneNode(true);
                nuevaFila.querySelector(".entrada-nombre").value = "";
                nuevaFila.querySelector(".entrada-cantidad").value = "";
                nutriente.appendChild(nuevaFila);
                inputTarget = nuevaFila.querySelector(".entrada-nombre");
            }

            inputTarget.value = ingredienteSeleccionado.nombre;
            ingredientesTotales.push(ingredientesFitness.find(x => x.nombre === ingredienteSeleccionado.nombre));
            const fila = inputTarget.closest(".fila-entrada");
            const cantidadInput = fila.querySelector(".entrada-cantidad");
            cantidadInput.value = "0";
            // Disparar evento 'input' tras asignar por código
            cantidadInput.dispatchEvent(new Event('input', { bubbles: true }));

            const datos = ingredientesFitness.find(x => x.nombre === ingredienteSeleccionado);
            /*actualizarBurbuja(fila, datos);

            fila.querySelector(".entrada-cantidad").addEventListener("input", () => {
                actualizarBurbuja(fila, datos);
                actualizarCaloriasActuales();
            });*/

            actualizarCaloriasActuales();
        }
    });

    document.querySelectorAll(".ingrediente").forEach(d => d.classList.remove("seleccionado"));
    ingredienteSeleccionado = null;
    categoriaSeleccionada = null;
});

// --------------------------------------------------------------------------------------
// 7. FUNCIONES DE BURBUJAS
// --------------------------------------------------------------------------------------
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
        e.target.value = e.target.value.replace(/\D/g,'');
        
        const fila = e.target.closest('.fila-entrada');
        actualizarBurbuja(fila);
    }
});

// --------------------------------------------------------------------------------------
// 8. INICIALIZACIÓN DEL ARRANQUE
// --------------------------------------------------------------------------------------
function inicializarLabels(){
    document.getElementById("InputOptimo").value = Math.round(CaloriasOptimas) + " kcal";
    document.getElementById("InputOptimoPP").value = Math.round(CaloriasOptimas / 3) + " kcal";
    document.getElementById("InputAgua").value = AguaRecomendada + " litros";
    localStorage.clear();
}


document.addEventListener('DOMContentLoaded', () => {
    contenedores = {
        proteina: document.getElementById("Proteina"),
        carb: document.getElementById("Carbohidratos"),
        grasas: document.getElementById("Grasas")
    };

    inicializarLabels();
    inicializarManejoPlatillos();
    cargarIngredientesDelAPI();
    cargarPlatillosDelApi();
    actualizarPlatillosGuardadosUI();
});