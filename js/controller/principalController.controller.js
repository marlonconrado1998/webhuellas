app.controller('principalController', principalController)

/** @ngInject */
principalController.$inject = ['principalService', '$location'];

function principalController(principalService, $location) {

    var ctrl = this;
    ctrl.listaAnimal = [];
    ctrl.informacionAnimal = {};
    ctrl.limit = { init: -8, end: 8, especie: 'Perro', cargando: false };
    ctrl.limit2 = { init: -8, end: 8, especie: 'Gato', cargando: false };

    ctrl.obtenerListadoAnimales = function (data) {
        data.cargando = true;
        principalService.obtenerListadoAnimales(data).then(function (response) {
            if (angular.isArray(response.data) && response.data.length) {
                for (var i = 0; i < response.data.length; i++) {
                    ctrl.listaAnimal.push(response.data[i]);
                }
                data.cargando = false;
            } else {
                data.cargando = null;
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
        ctrl.limit.init += 8;
        ctrl.obtenerListadoAnimales(ctrl.limit);
    }

    ctrl.cargarMasGatos = function () {
        ctrl.limit2.init += 8;
        ctrl.obtenerListadoAnimales(ctrl.limit2);
    }

    ctrl.cargarMasPerros();
    ctrl.cargarMasGatos();
}
