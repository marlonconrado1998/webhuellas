app.service('swetService', swetService)

/** @ngInject */

function swetService() {

    var service = this;

    service.SWAL_OPTION = swalOption;
    service.SWAL_INPUT = swalInput;
    service.SWAL_SUCCESS = swalSuccess;
    service.SWAL_WARNING = swalWarning;
    service.TOASTER = toaster;

    function swalOption(callback, preConfirm = function () { }, title = "¿Estás seguro?") {
        swal({
            type: 'question',
            title: title,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: function (result) {
                return preConfirm(result);
            },
            // allowOutsideClick: () => !swal.isLoading()
        }).then(function (result) {
            if (result.value)
                callback(true);
        });
    }

    function swalInput(inputValidator = function () { }, preConfirm = function () { }, callback, title, input) {
        swal({
            type: 'question',
            title: title,
            input: input,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            inputValidator: (value) => {
                var res = "";
                if (res = inputValidator(value)) return res;
            },
            preConfirm: function (result) {
                return preConfirm(result);
            },
            // allowOutsideClick: () => !swal.isLoading()
        }).then(function (result) {
            callback(result.value);
        });
    }

    function swalSuccess(title, html) {
        swal({
            type: 'success',
            title: title,
            html: html
        })
    }

    function swalWarning(title, html) {
        swal({
            type: 'warning',
            title: title,
            html: html
        })
    }

    function toaster(type, title, timer) {

        const toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: timer
        });
        toast({
            type: type,
            title: title
        });
    }
}
