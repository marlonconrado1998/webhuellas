app.service('principalService', principalService)

/** @ngInject */
principalService.$inject = ['generalService', 'generalURL'];

function principalService(generalService, generalURL) {

    var service = this;
    // VARIABLES
    service.listaAnimal = [];
    service.mailValidator = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    service.CIUDADES = [];
    service.testimonios = [];

    // METHODS
    service.obtenerListadoAnimales = getAnimalList;
    service.registrarPersona = postPerson;
    service.realizarSolicitud = makeSolicitud;
    service.consultarPersona = getPerson;
    service.getCiudades = getCiudades;
    service.sendMensaje = sendMensaje;
    service.obtenerTestimonios = getTestimonials;
    service.getMetadata = getMetadata;


    function getAnimalList(limit) {
        return generalService.EJECUTAR_PETICION("GET", "api_webSite.php/obtenerListaAnimal/" + limit.especie + "/" + limit.init + "/" + limit.end);
    }

    function postPerson(datos) {
        return generalService.EJECUTAR_PETICION("POST", "api_webSite.php/registrarPersona", {
            data: datos
        });
    }

    function getPerson(datos) {
        return generalService.EJECUTAR_PETICION("POST", "api_webSite.php/consultarPersona", {
            data: datos
        });
    }

    function makeSolicitud(datos) {
        return generalService.EJECUTAR_PETICION("POST", "api_webSite.php/realizarSolicitud", {
            data: datos
        });
    }

    function getCiudades() {
        return generalService.EJECUTAR_PETICION("GET", "api_generalRequest.php/ciudad");
    }

    function sendMensaje(msg) {
        return generalService.EJECUTAR_PETICION("POST", "api_correo.php/send", msg);
    }

    function getTestimonials() {
        return generalService.EJECUTAR_PETICION("GET", "api_webSite.php/obtenerTestimonios");
    }

    function getMetadata() {
        return generalService.EJECUTAR_PETICION("GET", "api_webSite.php/metadata");
    }
}