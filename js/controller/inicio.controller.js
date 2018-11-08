(function(){
    'use strict';

    app.controller('InicioController', InicioController)

    /** @ngInject */
    InicioController.$inject = ['inicioService'];


    function InicioController(inicioService){
        var vm = this;
        vm.metadata = angular.copy(JSON.parse(localStorage.getItem('metadata'))) || [];

        init();

        function init(){
            
            if (localStorage.getItem('metadata')) return false;
            inicioService.getMetadata().then(function (resp) {
                vm.metadata = resp.data;
                localStorage.setItem('metadata', JSON.stringify(resp.data));
            }).catch(function (error) {
                // console.log(error)
            }); 
        }

        vm.getIntoMetadata = function (label) {
            for (let index in vm.metadata) {
                if (vm.metadata[index].label == label) {
                    return vm.metadata[index]._value;
                }
            }
        }

    }

}());