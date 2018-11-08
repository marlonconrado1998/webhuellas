(function(){
    'use strict';

    app.service('inicioService', inicioService)

    /** @ngInject */
    inicioService.$inject = ['generalService'];

    function inicioService(service){

        var gestionService = this;
        gestionService.getMetadata = getMetadata;

        function getMetadata () {
            return service.EJECUTAR_PETICION('GET', 'api_webSite.php/metadata');
        }
    }

}());