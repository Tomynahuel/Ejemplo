(function ($) {

    "use strict";

    /* ===============================
       PAGE LOADING & ANIMATIONS
    =============================== */
    $(window).on('load', function () {
        $('#js-preloader').addClass('loaded');
    });

    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        var box = $('.header-text').height();
        var header = $('header').height();

        if (scroll >= box - header) {
            $("header").addClass("background-header");
        } else {
            $("header").removeClass("background-header");
        }
    });

    $('.owl-banner').owlCarousel({
        center: true,
        items: 1,
        loop: true,
        nav: true,
        dots: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        margin: 30,
        responsive: {
            992: { items: 1 },
            1200: { items: 1 }
        }
    });

    var width = $(window).width();
    $(window).resize(function () {
        if ((width > 767 && $(window).width() < 767) ||
            (width < 767 && $(window).width() > 767)) {
            location.reload();
        }
    });

    // ISOTOPE FILTER
    const elem = document.querySelector('.properties-box');
    const filtersElem = document.querySelector('.properties-filter');
    if (elem) {
        const rdn_events_list = new Isotope(elem, {
            itemSelector: '.properties-items',
            layoutMode: 'masonry'
        });
        if (filtersElem) {
            filtersElem.addEventListener('click', function (event) {
                if (!matchesSelector(event.target, 'a')) return;
                const filterValue = event.target.getAttribute('data-filter');
                rdn_events_list.arrange({ filter: filterValue });
                filtersElem.querySelector('.is_active').classList.remove('is_active');
                event.target.classList.add('is_active');
                event.preventDefault();
            });
        }
    }

    // MENU MOBILE
    if ($('.menu-trigger').length) {
        $(".menu-trigger").on('click', function () {
            $(this).toggleClass('active');
            $('.header-area .nav').slideToggle(200);
        });
    }

    /* ===============================
       DOCUMENT READY (LÓGICA PRINCIPAL)
    =============================== */
    $(document).ready(function () {

        // --- ⚙️ CONFIGURACIÓN DEL SISTEMA ---
        const numeroWhatsapp = "5493757685481"; 
        
        // TU URL DE GOOGLE APPS SCRIPT (Ya configurada)
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqFMBrF2C4eBBnyXpJd8qYMLlX-ThYclz1vA70ERn3zaGsKlrjx6M8AFkW0vXkcrBH/exec";

        // Función auxiliar para abrir WhatsApp
        function abrirWhatsapp(mensaje) {
            const url = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        }

        // --- CONTROL DE FECHAS (Bloquear pasado) ---
        const dateInput = document.getElementById('res-date');
        if (dateInput) {
            const hoy = new Date();
            const yyyy = hoy.getFullYear();
            const mm = String(hoy.getMonth() + 1).padStart(2, '0');
            const dd = String(hoy.getDate()).padStart(2, '0');
            const fechaMinima = `${yyyy}-${mm}-${dd}`;
            
            dateInput.setAttribute('min', fechaMinima);
            
            dateInput.addEventListener('change', function() {
                if (this.value && this.value < fechaMinima) {
                    alert("⚠️ No puedes seleccionar una fecha pasada.");
                    this.value = fechaMinima;
                }
            });
        }

        // --- BOTONES DE CONSULTA GENERAL ---
        $("#whatsapp-consulta").on("click", function(e) {
            e.preventDefault();
            abrirWhatsapp("Hola Taxis Iguazú! Tengo una consulta sobre los traslados.");
        });

        $("#whatsapp-header").on("click", function(e) {
            e.preventDefault();
            abrirWhatsapp("Hola! Me comunico desde la web, quisiera información.");
        });

        // --- SCROLL SUAVE ---
        $("a[href^='#']").on("click", function (e) {
            const href = $(this).attr('href');
            if (href.length > 1 && href !== '#') {
                const target = $(href);
                if (target.length) {
                    e.preventDefault();
                    if ($(window).width() < 991) {
                        $('.menu-trigger').removeClass('active');
                        $('.header-area .nav').slideUp(200);
                    }
                    $('html, body').animate({ scrollTop: target.offset().top - 80 }, 1200);
                }
            }
        });

        /* -------- PROCESO DE RESERVA (Formulario) -------- */
        const reservationForm = document.getElementById('reservation-form');

        if (reservationForm) {
            $(reservationForm).off('submit'); // Evitar duplicados

            reservationForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // 1. Capturar datos
                const nombre = document.getElementById('res-name').value;
                const fecha = document.getElementById('res-date').value;
                const hora = document.getElementById('res-time').value;
                const pasajeros = document.getElementById('res-passengers').value;
                const lugarRetiro = document.getElementById('res-pickup').value;
                const destinoSeleccionado = document.getElementById('res-destin').value;
                const lugarDestinoExacto = document.getElementById('res-dropoff').value || "";

                // 2. Validación de Horario (Seguridad)
                if (fecha && hora) {
                    const fechaObj = new Date(fecha + 'T00:00:00');
                    const hoyObj = new Date();
                    hoyObj.setHours(0,0,0,0);

                    if (fechaObj.getTime() === hoyObj.getTime()) {
                        const ahoraMismo = new Date();
                        const partesHora = hora.split(':');
                        const horaSeleccionada = new Date();
                        horaSeleccionada.setHours(partesHora[0], partesHora[1], 0, 0);

                        // Margen de 1 hora
                        const margen = new Date(ahoraMismo.getTime() + 60*60*1000);

                        if (horaSeleccionada < ahoraMismo) {
                            alert("⚠️ La hora seleccionada ya pasó. Por favor elige un horario futuro.");
                            return; 
                        }
                        if (horaSeleccionada < margen) {
                            alert("⚠️ Para reservas inmediatas (menos de 1 hora), usa el botón 'Consultas Rápidas' para confirmar disponibilidad ya.");
                            return; 
                        }
                    }
                }

                // 3. ENVIAR A GOOGLE (Backend Silencioso)
                const formData = new FormData();
                formData.append("nombre", nombre);
                formData.append("fecha", fecha);
                formData.append("hora", hora);
                formData.append("pasajeros", pasajeros);
                formData.append("origen", lugarRetiro);
                formData.append("destino", destinoSeleccionado);
                formData.append("detalles", lugarDestinoExacto);

                fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors", // Envío 'ciego' para evitar bloqueos del navegador
                    body: formData
                }).then(() => {
                    console.log("✅ Reserva guardada en Google Sheets/Calendar");
                }).catch(err => {
                    console.error("❌ Error guardando backup:", err);
                });

                // 4. ABRIR WHATSAPP (Cliente)
                let mensaje = `Hola Taxis Iguazú!\nSoy ${nombre} y quisiera realizar una reserva:\n\n- Fecha: ${fecha}\n- Hora: ${hora}\n- Pasajeros: ${pasajeros}\n- Origen: ${lugarRetiro}\n- Destino: ${destinoSeleccionado}`;
                
                if (lugarDestinoExacto) mensaje += `\n- Detalle: ${lugarDestinoExacto}`;
                mensaje += `\n\nAguardo confirmación.`;

                abrirWhatsapp(mensaje);
                
                // Opcional: Avisar en pantalla que se está procesando
                // alert("Abriendo WhatsApp para confirmar tu reserva...");
            });
        }

    });

})(window.jQuery);