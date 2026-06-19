// ==========================================
// 1. FUNCIÓN GLOBAL DE COPIADO BANCARIO
// ==========================================
window.copiarDatoBancario = function(idElemento, boton) {
    const contenedorDato = document.getElementById(idElemento);
    if (!contenedorDato) return;
    
    const textoACopiar = contenedorDato.innerText;
    
    navigator.clipboard.writeText(textoACopiar).then(() => {
        const textoOriginal = boton.innerText;
        boton.innerText = "¡Copiado! ✓";
        boton.classList.add("copiado");
        
        setTimeout(() => {
            boton.innerText = textoOriginal;
            boton.classList.remove("copiado");
        }, 2000);
    }).catch(err => {
        console.error("Error al copiar el dato: ", err);
    });
};

// ==========================================
// 2. LÓGICA PRINCIPAL AL CARGAR EL DOM
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    const sobreClic = document.getElementById("sobre-clic");
    const pantallaSobre = document.getElementById("pantalla-sobre");
    const contenidoInvitacion = document.getElementById("contenido-invitacion");
    const musica = document.getElementById("musica-boda");

    const fechaBoda = new Date("Jan 8, 2027 19:00:00").getTime();
    const fechaLimite = new Date("Jul 20, 2026 23:59:00").getTime();

    // Captura de Parámetros URL
    const urlParams = new URLSearchParams(window.location.search);
    const idInvitadoUrl = urlParams.get('id');
    const nombreInvitado = urlParams.get('invitado');
    const pasesInvitado = urlParams.get('pases');
    const tipoInvitado = urlParams.get('tipo'); 

    // Control Automático de Estado "Visto"
    if (idInvitadoUrl) {
        try {
            let dbInvitados = JSON.parse(localStorage.getItem('boda_invitados')) || [];
            let existe = dbInvitados.some(inv => inv.id === idInvitadoUrl);
            if (existe) {
                dbInvitados = dbInvitados.map(inv => {
                    if (inv.id === idInvitadoUrl && inv.estado === 'enviado') {
                        inv.estado = 'visto';
                    }
                    return inv;
                });
                localStorage.setItem('boda_invitados', JSON.stringify(dbInvitados));
            }
        } catch (e) {
            console.log("Aviso de almacenamiento local.");
        }
    }

    // Inyectar Nombre del Invitado
    if (nombreInvitado) {
        document.getElementById('nombre-invitado').innerText = decodeURIComponent(nombreInvitado);
    } else {
        document.getElementById('nombre-invitado').innerText = "Invitado Especial";
    }
    
    // Procesar Lista de Pases en Filas Verticales
    if (pasesInvitado) {
        const textoPases = decodeURIComponent(pasesInvitado);
        const contenedorLista = document.getElementById('detalle-pases');
        
        if (contenedorLista) {
            contenedorLista.innerHTML = ""; 
            const arrayNombres = textoPases.split(',');
            
            arrayNombres.forEach(nombre => {
                const nombreLimpio = nombre.trim();
                if(nombreLimpio !== "") {
                    const elementoFila = document.createElement('li');
                    elementoFila.innerText = nombreLimpio;
                    contenedorLista.appendChild(elementoFila);
                }
            });
        }
    }

    // Segmentación por Ubicación (Local vs Afuera)
    const divInternacionales = document.getElementById('seccion-internacionales');
    const divRegalos = document.getElementById('seccion-regalos');

    if (tipoInvitado === 'afuera') {
        if (divInternacionales) divInternacionales.style.display = 'block';
        if (divRegalos) divRegalos.style.display = 'block';
    } else {
        if (divInternacionales) divInternacionales.style.display = 'none';
        if (divRegalos) divRegalos.style.display = 'none';
    }

    // Mecanismo de Apertura del Sobre
    if (sobreClic) {
        sobreClic.onclick = function() {
            if (pantallaSobre) pantallaSobre.classList.add("sobre-desvanecido");
            if (contenidoInvitacion) contenidoInvitacion.classList.add("mostrar-contenido");

            if (musica) {
                musica.play().catch(() => console.log("Audio esperando interacción activa."));
            }
            lanzarLluviaPetalos();
        };
    }

    // Generador de Efecto Visual (Pétalos)
    function lanzarLluviaPetalos() {
        const contenedor = document.getElementById("contenedor-petalos");
        if (!contenedor) return;
        contenedor.innerHTML = ""; 

        for (let i = 0; i < 40; i++) {
            const petalo = document.createElement("div");
            petalo.classList.add("petalo");
            petalo.style.width = `${Math.random() * 10 + 8}px`;
            petalo.style.height = `${Math.random() * 12 + 10}px`;
            petalo.style.left = `${Math.random() * 100}vw`;
            petalo.style.animationDuration = `${Math.random() * 2 + 2}s`;
            petalo.style.animationDelay = `${Math.random() * 0.5}s`;
            contenedor.appendChild(petalo);
        }
    }

    // Gestión Dinámica de los Relojes
    function actualizarContadores() {
        const ahora = new Date().getTime();

        // 1. Reloj de la Boda
        const contBoda = document.getElementById("contador-boda");
        if (contBoda) {
            const difBoda = fechaBoda - ahora;
            if (difBoda < 0) {
                contBoda.innerHTML = "<p>¡Llegó el gran día!</p>";
            } else {
                const d = Math.floor(difBoda / (1000 * 60 * 60 * 24));
                const h = Math.floor((difBoda % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((difBoda % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((difBoda % (1000 * 60)) / 1000);
                contBoda.innerHTML = `
                    <div class="contador-display">
                        <div class="unidad-tiempo"><span class="numero">${d}</span><span class="etiqueta">Días</span></div>
                        <div class="unidad-tiempo"><span class="numero">${h}</span><span class="etiqueta">Horas</span></div>
                        <div class="unidad-tiempo"><span class="numero">${m}</span><span class="etiqueta">Min</span></div>
                        <div class="unidad-tiempo"><span class="numero">${s}</span><span class="etiqueta">Seg</span></div>
                    </div>
                `;
            }
        }

        // 2. Reloj Límite de Confirmación
        const contConfirmar = document.getElementById("contador-confirmacion");
        const btnPresencial = document.getElementById("btn-presencial");
        if (contConfirmar) {
            const difLimite = fechaLimite - ahora;
            if (difLimite < 0) {
                contConfirmar.className = "contador-display semaforo-rojo";
                contConfirmar.innerHTML = "<p style='margin:0 auto; font-weight:bold; color:#c62828;'>El período de confirmación ha finalizado</p>";
                if (btnPresencial) btnPresencial.style.display = "none";
            } else {
                const d = Math.floor(difLimite / (1000 * 60 * 60 * 24));
                const h = Math.floor((difLimite % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((difLimite % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((difLimite % (1000 * 60)) / 1000);

                let semaforo = "semaforo-verde";
                if (d < 15 && d >= 7) semaforo = "semaforo-amarillo";
                else if (d < 7) semaforo = "semaforo-rojo";

                contConfirmar.className = `contador-display ${semaforo}`;
                contConfirmar.innerHTML = `
                    <div class="unidad-tiempo"><span class="numero">${d}</span><span class="etiqueta">Días</span></div>
                    <div class="unidad-tiempo"><span class="numero">${h}</span><span class="etiqueta">Horas</span></div>
                    <div class="unidad-tiempo"><span class="numero">${m}</span><span class="etiqueta">Min</span></div>
                    <div class="unidad-tiempo"><span class="numero">${s}</span><span class="etiqueta">Seg</span></div>
                `;
            }
        }
    }

    // Inicialización y bucle de los relojes
    setInterval(actualizarContadores, 1000);
    actualizarContadores();

    // Integración de Calendario Google
    const btnCal = document.getElementById("btn-calendario");
    if (btnCal) {
        btnCal.onclick = function() {
            const titulo = encodeURIComponent("Matrimonio de Dayana y Exio");
            const detalles = encodeURIComponent("Acompáñanos a celebrar nuestra unión.");
            const ubicacion = encodeURIComponent("La Terraza del Portón, Av. Gran Colombia #6E-57, Cúcuta");
            window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=20270108T190000/20270109T020000&details=${detalles}&location=${ubicacion}`, '_blank');
        };
    }
});