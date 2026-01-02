(function ($) {
	
	"use strict";

	// Page loading animation
	$(window).on('load', function() {
		$('#js-preloader').addClass('loaded');
	});

	$(window).scroll(function() {
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
	  items:1,
	  loop:true,
	  nav: true,
	  dots:true,
	  navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
	  margin:30,
	  responsive:{
		992:{
			items:1
		},
		1200:{
			items:1
		}
	  }
	});

	var width = $(window).width();
		$(window).resize(function() {
		if (width > 767 && $(window).width() < 767) {
			location.reload();
		}
		else if (width < 767 && $(window).width() > 767) {
			location.reload();
		}
	});

	const elem = document.querySelector('.properties-box');
	const filtersElem = document.querySelector('.properties-filter');
	if (elem) {
		const rdn_events_list = new Isotope(elem, {
			itemSelector: '.properties-items',
			layoutMode: 'masonry'
		});
		if (filtersElem) {
			filtersElem.addEventListener('click', function(event) {
				if (!matchesSelector(event.target, 'a')) {
					return;
				}
				const filterValue = event.target.getAttribute('data-filter');
				rdn_events_list.arrange({
					filter: filterValue
				});
				filtersElem.querySelector('.is_active').classList.remove('is_active');
				event.target.classList.add('is_active');
				event.preventDefault();
			});
		}
	}

	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}

    // --- INICIO DE LÓGICA DE RESERVAS Y SCROLL ---
    $(document).ready(function() {
        // Scroll suave para todos los enlaces internos
        $("a[href^='#']").on("click", function(e) {
            var href = $(this).attr('href');
            if (href.length > 1 && href.charAt(0) === '#') {
                var target = $(href);
                if(target.length) {
                    e.preventDefault();
                    var width = $(window).width();
                    if(width < 991) {
                        $('.menu-trigger').removeClass('active');
                        $('.header-area .nav').slideUp(200);
                    }
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 1200, 'swing');
                }
            }
        });

        // Manejo del Formulario de Reservas
        const reservationForm = document.getElementById('reservation-form');
        if (reservationForm) {
            reservationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // 1. Obtener valores
                const nombre = document.getElementById('res-name').value; // NUEVO
                const fecha = document.getElementById('res-date').value;
                const hora = document.getElementById('res-time').value;
                const pasajeros = document.getElementById('res-passengers').value; 
                const lugarRetiro = document.getElementById('res-pickup').value; 
                const destinoSeleccionado = document.getElementById('res-destin').value;
                const lugarDestinoExacto = document.getElementById('res-dropoff').value;

                const nroTelefono = "5493764618983"; 

                // 2. Armar mensaje
                let mensaje = "Hola Taxis Iguazú! Soy " + encodeURIComponent(nombre) + ". Quisiera realizar una reserva:%0A" + // NUEVO
                              "- *Fecha:* " + encodeURIComponent(fecha) + "%0A" +
                              "- *Hora:* " + encodeURIComponent(hora) + "%0A" +
                              "- *Pasajeros:* " + encodeURIComponent(pasajeros) + "%0A" + 
                              "- *Origen:* " + encodeURIComponent(lugarRetiro) + "%0A" +
                              "- *Destino:* " + encodeURIComponent(destinoSeleccionado) + "%0A";

                if (lugarDestinoExacto && lugarDestinoExacto.trim() !== "") {
                    mensaje += "- *Detalle Destino:* " + encodeURIComponent(lugarDestinoExacto) + "%0A";
                }

                mensaje += "Aguardo confirmación.";

                // 3. Enviar
                window.open(`https://api.whatsapp.com/send?phone=${nroTelefono}&text=${mensaje}`, '_blank');
            });
        }
    }); 
    // --- FIN DE LÓGICA DE RESERVAS ---

	// Page loading animation final
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});

})(window.jQuery);