app.controller('principalController', principalController)

/** @ngInject */
principalController.$inject = ['principalService', '$location'];

function principalController(principalService, $location) {

    var ctrl = this;
    var contador_peticion = 0;
    ctrl.listaAnimal = [];
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
                }else{
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

    ctrl.cargarMasPerros();
    ctrl.cargarMasGatos();
}
