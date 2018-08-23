app.controller('usuarioController', usuarioController)

/** @ngInject */
usuarioController.$inject = ['principalService', '$location'];

function usuarioController(principalService, $location) {

    var ctrl = this;

    // VARIABLES
    ctrl.ciudades = principalService.CIUDADES;
    ctrl.mailValidator = principalService.mailValidator;
    ctrl.solicitud = {};
    var informacionPersona = {};
    ctrl.informacionAnimal = principalService.informacionAnimal;
    ctrl.enviandoSolicitud = false;

    function getCities() {
        // if (ctrl.ciudades.length == 0) {
        principalService.getCiudades()
            .then(function (response) {
                principalService.CIUDADES = response.data;
                ctrl.ciudades = principalService.CIUDADES;
            });
        // }
    }

    getCities();

    ctrl.registrarPersona = function (datos) {
        swal({
            type: 'question',
            title: '¿Estan correctos tus datos?',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return principalService.registrarPersona(datos).then(function (response) {
                    console.log(response);
                    if (response.code === "ERROR") {
                        throw new Error('¡Usuario ya existe!')
                    }
                    return response;
                }).catch(function (error) {
                    swal.showValidationError(
                        error
                    )
                })
            },
            allowOutsideClick: function () { !swal.isLoading() }
        }).then(function (result) {
            console.log(result);
            if (result.value) {
                swal({
                    type: 'success',
                    title: '¡Felicitaciones!',
                    text: 'Acabas de ser registrado.',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        })
        // $location.path("/Inicio");
        // principalService.registrarPersona(datos).then(function (response) {
        //     console.log(response);

        // }).catch(function (error) {
        //     toaster('error', 'Error al realizar el registro.', 3500);
        // });
    }

    // ctrl.consultarPersona = function (id, correo, animal) {
    //     principalService.consultarPersona({ correo: correo, id: id }).then(function (response) {
    //         console.log(response);
    //         if (response.data.error == undefined && response.data.error == null) {
    //             ctrl.solicitud = response.data;
    //             ctrl.solicitud.idamimal = animal;
    //         } else {
    //             console.log(response.data);
    //             toaster('error', response.data.error, 3500);
    //         }
    //     }).catch(function (error) {
    //         toaster('error', 'Error al consultar sus datos.', 3500);
    //     });
    // }

    ctrl.solicitarAdopcion = function (id, correo, animal) {
        console.log(id, correo, animal);
        principalService.consultarPersona({ correo: correo, id: id }).then(function (response) {
            if (response.code === "ERROR") {
                toaster('error', response.message, 3500);
            } else {
                ctrl.solicitud = response.data;
                ctrl.solicitud.idanimal = animal;
                ctrl.solicitud.telefono = parseInt(ctrl.solicitud.telefono);
                ctrl.solicitud.telefono_oficina = parseInt(ctrl.solicitud.telefono_oficina);

                angular.forEach(ctrl.ciudades, function (value) {
                    if (angular.equals(ctrl.solicitud.ciudad, value.nombre)) { ctrl.solicitud.ciudad = value; }
                });
                angular.forEach(ctrl.ciudades, function (value) {
                    if (angular.equals(ctrl.solicitud.ciudad_empresa, value.nombre)) {
                        ctrl.solicitud.ciudad_empresa = value;
                        informacionPersona = angular.copy(ctrl.solicitud);
                    }
                });

                $('#modalSolicitudAdopcion').modal('show');
            }
        }).catch(function (error) {
            toaster('error', 'Error al solicitar adopción.', 3500);
        });
    }

    ctrl.realizarSolicitud = function () {
        ctrl.solicitud.motivo_adopcion = ctrl.solicitud.motivo_adopcion.trim();

        if ((ctrl.solicitud.motivo_adopcion).trim().length > 10) {
            informacionPersona.motivo_adopcion = ctrl.solicitud.motivo_adopcion;

            ctrl.solicitud.actualizar = !angular.equals(ctrl.solicitud, informacionPersona);
            //Deshabilitar el boton de realizar solicitud...
            ctrl.enviandoSolicitud = true;

            principalService.realizarSolicitud(ctrl.solicitud).then(function (response) {
                if (response.data.error) {
                    toaster('error', response.data.error + ' No se puede realizar la solicitud.', 4000);
                } else {
                    $('#modalSolicitudAdopcion').modal('hide');
                    swal({
                        type: "success",
                        title: "¡Felicitaciones!",
                        html: "<p>Tu solicitud acaba de ser registrada. Dentro de 8 dias habiles le daremos respuesta a traves de correo o llamada.</p>",
                        confirmButtonText: '¡Gracias!'
                    });
                    ctrl.solicitud = {};
                    informacionPersona = {};
                    ctrl.informacionAnimal = {};
                }
            }).catch(function (error) {
                console.log(error);
                toaster('error', 'Error al completar la solicitud. ', 3500);
            });
        } else {
            toaster('warning', 'Escribe un motivo de adopcion mas explicito.', 5000);
        }
    }

    ctrl.verifyInput = function (key, _max, _count) {
        
        // console.log($('input[id="Identificacion"] + span[name="mensaje"]'));
        console.log(key.key, _count, _max);
        // var padre ; 
        // $("div:has(p)")
        // $("td:parent") 
        if(_count.length <=_max){
            if(key.key != "." && key.key != "e"){
                
            }
        }
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
        })
    }
}
