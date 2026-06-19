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

    // Capturar el nuevo parámetro de URL estético (?to=Nombre-Apellido)
    const urlParams = new URLSearchParams(window.location.search);
    const aliasInvitado = urlParams.get('to'); 

    // Valores predeterminados por si acaso
    let nombreInvitado = "Invitado Especial";
    let pasesInvitado = "";
    let tipoInvitado = "local";
    let idInvitadoUrl = null;

    // BUSCADOR EN LA BASE DE DATOS LOCAL
    if (aliasInvitado) {
        try {
            const dbInvitados = JSON.parse(localStorage.getItem('boda_invitados')) || [];
            // Reconstruimos el formato original sustituyendo guiones por espacios
            const nombreBuscado = aliasInvitado.replace(/-/g, ' ').toLowerCase().trim();

            const invitadoEncontrado = dbInvitados.find(inv => inv.nombre.toLowerCase().trim() === nombreBuscado);

            if (invitadoEncontrado) {
                idInvitadoUrl = invitadoEncontrado.id;
                nombreInvitado = invitadoEncontrado.nombre;
                pasesInvitado = invitadoEncontrado.pases;
                tipoInvitado = invitadoEncontrado.tipo || 'local';

                // Cambiar estado a "visto" discretamente si estaba en "enviado"
                if (invitadoEncontrado.estado === 'enviado') {
                    invitadoEncontrado.estado = 'visto';
                    localStorage.setItem('boda_invitados', JSON.stringify(dbInvitados));
                }
            } else {
                // Si el link se abre en otro dispositivo sin BD, igual formatea el nombre para la visualización
                nombreInvitado = aliasInvitado.replace(/-/g, ' ');
            }
        } catch (e) {
            console.log("Error de lectura en base de datos.");
            nombreInvitado = aliasInvitado.replace(/-/g, ' ');
        }
    }

    // Inyectar Nombre del Invitado en el HTML
    document.getElementById('nombre-invitado').innerText = nombreInvitado;
    
    // Renderizar la lista de pases en filas limpias
    const contenedorLista = document.getElementById('detalle-pases');
    if (contenedorLista) {
        contenedorLista.innerHTML = ""; 
        if (pasesInvitado) {
            const arrayNombres = pasesInvitado.split(',');
            arrayNombres.forEach(nombre => {
                const nombreLimpio = nombre.trim();
                if(nombreLimpio !== "") {
                    const elementoFila = document.createElement('li');
                    elementoFila.innerText = nombreLimpio;
                    contenedorLista.appendChild(elementoFila);
                }
            });
        } else {
            const elementoFila = document.createElement('li');
            elementoFila.innerText = "Pase Personal Familiar";
            contenedorLista.appendChild(elementoFila);
        }
    }

    // Mostrar u ocultar módulos según si es invitado de "afuera" o "local"
    const divInternacionales = document.getElementById('seccion-internacionales');
    const divRegalos = document.getElementById('seccion-regalos');

    if (tipoInvitado === 'afuera') {
        if (divInternacionales) divInternacionales.style.display = 'block';
        if (divRegalos) divRegalos.style.display = 'block';
    } else {
        if (divInternacionales) divInternacionales.style.display = 'none';
        if (divRegalos) divRegalos.style.display = 'none';
    }

    // Mecanismo de Apertura del Sobre de Canva
    if (sobreClic) {
        sobreClic.onclick = function() {
            if (pantallaSobre) pantallaSobre.classList.add("sobre-desvanecido");
            if (contenidoInvitacion) contenidoInvitacion.classList.add("mostrar-contenido");

            if (musica) {
                musica.play().catch(() => console.log("Permisos de reproducción pendientes."));
            }
            lanzarLluviaPetalos();
        };
    }

    // Efecto visual de los Pétalos
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

    // Manejo de Relojes
    function actualizarContadores() {
        const ahora = new Date().getTime();

        // Reloj Boda
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

        // Reloj Límite Confirmación
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

    setInterval(actualizarContadores, 1000);
    actualizarContadores();

    // Calendario de Google
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