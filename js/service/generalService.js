app.service('generalService', generalService)

/** @ngInject */
generalService.$inject = ['$http', '$q', 'generalURL'];

function generalService($http, $q, generalURL) {

    var service = this;

    service.EJECUTAR_PETICION = makeRequest;
    service.SWAL_OPTION = swalOption;
    service.url = generalURL;

    function makeRequest(METHOD, URL, DATA) {

        METHOD = METHOD.toUpperCase();

        var defer = $q.defer();
        var url = service.url + URL;

        $http({
            "method": METHOD,
            "url": url,
            "data": DATA
        }).then(function (response) {
            defer.resolve(response.data);
        }).catch(function (error) {
            defer.reject(error);
        });

        return defer.promise;
    }

    function swalOption(callback, title) {
        swal({
            type: 'question',
            title: title,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
        }).then(function (result) {
            if (result.value)
                callback(true)
            else
                callback(false)
        });
    }
}
