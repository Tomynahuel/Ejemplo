(function ($) {

    "use strict";

    /* ===============================
       PAGE LOADING
    =============================== */
    $(window).on('load', function () {
        $('#js-preloader').addClass('loaded');
    });

    /* ===============================
       HEADER SCROLL
    =============================== */
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

    /* ===============================
       OWL CAROUSEL
    =============================== */
    $('.owl-banner').owlCarousel({
        center: true,
        items: 1,
        loop: true,
        nav: true,
        dots: true,
        navText: [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>'
        ],
        margin: 30,
        responsive: {
            992: { items: 1 },
            1200: { items: 1 }
        }
    });

    /* ===============================
       RESPONSIVE RELOAD
    =============================== */
    var width = $(window).width();
    $(window).resize(function () {
        if ((width > 767 && $(window).width() < 767) ||
            (width < 767 && $(window).width() > 767)) {
            location.reload();
        }
    });

    /* ===============================
       ISOTOPE FILTER
    =============================== */
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

    /* ===============================
       MENU MOBILE
    =============================== */
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

        // --- CONFIGURACIÓN CENTRAL ---
        // CAMBIA EL NÚMERO AQUÍ Y SE ACTUALIZA EN TODOS LOS BOTONES
        const numeroWhatsapp = "5493757685481"; 

        // Función auxiliar para abrir WhatsApp
        function abrirWhatsapp(mensaje) {
            const url = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        }

        /* -------- 1. BOTONES DE CONSULTA GENERAL (NUEVO) -------- */
        
        // Botón "Consultas Rápidas" (Pie de página)
        $("#whatsapp-consulta").on("click", function(e) {
            e.preventDefault();
            abrirWhatsapp("Hola Taxis Iguazú! Tengo una consulta sobre los traslados.");
        });

        // Botón del Header (Menú "Contacto" con logo)
        $("#whatsapp-header").on("click", function(e) {
            e.preventDefault();
            abrirWhatsapp("Hola! Me comunico desde la web, quisiera información.");
        });


        /* -------- 2. SCROLL SUAVE -------- */
        $("a[href^='#']").on("click", function (e) {
            const href = $(this).attr('href');
            // Evitamos que afecte a los enlaces vacíos como href="#"
            if (href.length > 1 && href !== '#') {
                const target = $(href);
                if (target.length) {
                    e.preventDefault();

                    if ($(window).width() < 991) {
                        $('.menu-trigger').removeClass('active');
                        $('.header-area .nav').slideUp(200);
                    }

                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 1200);
                }
            }
        });

        /* -------- 3. FORMULARIO DE RESERVA -------- */
        const reservationForm = document.getElementById('reservation-form');

        if (reservationForm) {
            reservationForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const nombre = document.getElementById('res-name').value;
                const fecha = document.getElementById('res-date').value;
                const hora = document.getElementById('res-time').value;
                const pasajeros = document.getElementById('res-passengers').value;
                const lugarRetiro = document.getElementById('res-pickup').value;
                const destinoSeleccionado = document.getElementById('res-destin').value;
                const lugarDestinoExacto = document.getElementById('res-dropoff').value;

                // Armado del mensaje con saltos de línea claros
                let mensaje =
`Hola Taxis Iguazú!
Soy ${nombre} y quisiera realizar una reserva:

- Fecha: ${fecha}
- Hora: ${hora}
- Pasajeros: ${pasajeros}
- Origen: ${lugarRetiro}
- Destino: ${destinoSeleccionado}`;

                if (lugarDestinoExacto && lugarDestinoExacto.trim() !== "") {
                    mensaje += `\n- Detalle destino: ${lugarDestinoExacto}`;
                }

                mensaje += `\n\nAguardo confirmación.`;

                // Usamos la función centralizada
                abrirWhatsapp(mensaje);
            });
        }

    });

})(window.jQuery);