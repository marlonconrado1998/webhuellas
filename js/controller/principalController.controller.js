app.controller('principalController', principalController)

/** @ngInject */
principalController.$inject = ['principalService', '$location'];

function principalController(principalService, $location) {

    var ctrl = this;
    var contador_peticion = 0;
    var indice_testimonio = 0;
    ctrl.listaAnimal = [];
    ctrl.testimonios = principalService.testimonios;
    ctrl.testimonio = {};
    ctrl.informacionAnimal = {};
    ctrl.limit_perros = { init: -8, end: 8, especie: 'Perro', cargando: true };
    ctrl.limit_gatos = { init: -8, end: 8, especie: 'Gato', cargando: true };

    ctrl.obtenerListadoAnimales = function (data) {
        data.cargando = true;
        principalService.obtenerListadoAnimales(data).then(function (response) {

            if (typeof response == 'object') {
                if (response.data.length) {
                    for (var i = 0; i < response.data.length; i++) {
                        ctrl.listaAnimal.push(response.data[i]);
                    }
                    data.cargando = false;
                } else {
                    data.cargando = null;
                }
                contador_peticion = 0;
            } else {
                if (contador_peticion < 3) {
                    ctrl.obtenerListadoAnimales(data);
                    contador_peticion++;
                } else {
                    data.cargando = false;
                }
            }
        }).catch(function (error) {
            data.cargando = false;
        });
    }

    ctrl.verDetalles = function (animal) {
        ctrl.informacionAnimal = animal;
        $('#modalVerAnimal').modal('show');
    }

    ctrl.iniciarSolicitud = function (animal) {
        principalService.informacionAnimal = animal;
        $('#modalVerAnimal').modal('hide');
        $location.path("/Adopciones");
    }

    ctrl.cargarMasPerros = function () {
        ctrl.limit_perros.init += 8;
        ctrl.obtenerListadoAnimales(ctrl.limit_perros);
    }

    ctrl.cargarMasGatos = function () {
        ctrl.limit_gatos.init += 8;
        ctrl.obtenerListadoAnimales(ctrl.limit_gatos);
    }

    ctrl.obtenerTestimonios = function () {
        if (principalService.testimonios.length != 0) {
            ctrl.testimonios = principalService.testimonios;
            indice_testimonio = Math.floor(Math.random() * ctrl.testimonios.length);
            seleccionarTestimonio(indice_testimonio);
        } else {
            principalService.obtenerTestimonios().then(function (response) {
                ctrl.testimonios = response.data;
                principalService.testimonios = response.data;
                indice_testimonio = Math.floor(Math.random() * ctrl.testimonios.length);
                seleccionarTestimonio(indice_testimonio);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    ctrl.cambiarTestimonio = function (direccion) {

        if (direccion < 0) {
            if (indice_testimonio == 0) {
                indice_testimonio = ctrl.testimonios.length - 1;
            } else {
                indice_testimonio -= 1;
            }
        } else {
            if (indice_testimonio == (ctrl.testimonios.length - 1)) {
                indice_testimonio = 0;
            } else {
                indice_testimonio += 1;
            }
        }
        seleccionarTestimonio(indice_testimonio);
    }

    function seleccionarTestimonio(indice) {
        ctrl.testimonio = ctrl.testimonios[indice];
    }

    ctrl.cargarMasPerros();
    ctrl.cargarMasGatos();
    ctrl.obtenerTestimonios();
}
