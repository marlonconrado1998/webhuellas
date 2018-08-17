app.controller('principalController', principalController)

/** @ngInject */
principalController.$inject = ['principalService', '$location'];

function principalController(principalService, $location) {

    var ctrl = this;
    ctrl.listaAnimal = principalService.listaAnimal;
    ctrl.informacionAnimal = {};

    ctrl.array_dogs = [
        { image: 'img/dg1.jpg', name: 'Firulais' },
        { image: 'img/dg2.jpg', name: 'Pola' },
        { image: 'img/dg3.jpg', name: 'Pepe' },
        { image: 'img/dg4.jpg', name: 'Lucho' },
        { image: 'img/dg5.jpg', name: 'Rocky' },
        { image: 'img/dg6.jpg', name: 'Campeon' },
        { image: 'img/dg7.jpg', name: 'Luna' },
        { image: 'img/dg8.jpg', name: 'Sophia' }
    ];

    ctrl.array_cats = [
        { image: 'img/ct1.jpg', name: 'Gatubela' },
        { image: 'img/ct2.jpg', name: 'Mañe' },
        { image: 'img/ct3.jpg', name: 'Manuela' },
        { image: 'img/ct4.jpg', name: 'Goloza' },
        { image: 'img/ct5.jpg', name: 'Gardfield' },
        { image: 'img/ct6.jpg', name: 'Jeton' },
        { image: 'img/ct7.jpg', name: 'Gloria' },
        { image: 'img/ct8.jpg', name: 'Gata' }
    ];

    ctrl.obtenerListadoAnimales = function () {
        if (principalService.listaAnimal.length > 0) {
            ctrl.listaAnimal = principalService.listaAnimal;
        } else {
            principalService.obtenerListadoAnimales().then(function (response) {
                console.log(response.data);
                principalService.listaAnimal = response.data;
                ctrl.listaAnimal = principalService.listaAnimal;
            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    ctrl.verDetalles = function (animal) {
        ctrl.informacionAnimal = animal;
        $('#modalVerAnimal').modal('show');
    }

    ctrl.iniciarSolicitud = function (animal) {
        principalService.informacionAnimal = animal;
        console.log(animal);
        $('#modalVerAnimal').modal('hide');
        $location.path("/Adopciones");
    }

    ctrl.obtenerListadoAnimales();
}
