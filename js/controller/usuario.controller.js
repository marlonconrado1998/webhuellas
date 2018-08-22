app.controller('usuarioController', usuarioController)

/** @ngInject */
usuarioController.$inject = ['principalService', '$location'];

function usuarioController(principalService, $location) {

    var ctrl = this;
    var alfabeto = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,ñ,o,p,q,r,s,t,u,v,w,x,y,z";
    var plantilla =
        '<div>' +
        '<center>' +
        '<h2>¡Bienvenido a huellas de amor!</h2>' +
        '</center>' +
        '<p>' +
        'En la Fundación Huellas de Amor, consideramos las cinco “libertades” esenciales para los animales:' +
        '</p>' +
        '<ul>' +
        '<li>Libres de hambre y sed</li>' +
        '<li>Libres de dolor lesiones y enfermedades</li>' +
        '<li>Libres de miedo y angustia</li>' +
        '<li>Libres de incomodidad</li>' +
        '<li>Libertad de expresar su comportamiento normal</li>' +
        '</ul>';

    // VARIABLES

    ctrl.ciudades = principalService.CIUDADES;
    ctrl.mailValidator = principalService.mailValidator;
    ctrl.solicitud = {};
    var informacionPersona = {};
    ctrl.informacionAnimal = principalService.informacionAnimal;
    ctrl.loading = false;

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

        ctrl.loading = true;
        ctrl.code = generarCodigo();
        var msg = {
            name: "Fundacion huellas de amor",
            email: "customershuellas@gmail.com",
            subject: "Codigo de confirmacion de registro",
            body: plantilla + 'Aqui tiene tu codigo de confirmacion:  <strong>' + ctrl.code + '<strong></div>',
            to: datos.correo
        }

        principalService.sendMensaje(msg).then(function () {
            ctrl.loading = false;
            swal({
                type: 'question',
                title: 'Ingresa el código que enviamos a tu correo',
                input: "text",
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                allowOutsideClick: false,
                showLoaderOnConfirm: true,
                inputValidator: (value) => {
                    if (!value) return "Introduce el código que enviamos a tu correo.";
                    if (value !== ctrl.code) return "Código incorrecto.";
                },
                preConfirm: function () {
                    return principalService.registrarPersona(datos).then(function (response) {
                        if (response["code"] == "OK") {
                            return response;
                        }
                    }).catch(function (error) {
                        swal.showValidationError(
                            error
                        )
                    });
                },
                allowOutsideClick: function () { !swal.isLoading() }
            }).then(function (result) {
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
        });
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
            if (response.data.error) {
                toaster('error', response.data.error, 3500);
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

    function generarCodigo() {
        var arrAlfabeto = alfabeto.split(",");
        return (arrAlfabeto[Math.floor((Math.random() * 27) + 1)]) +
            (arrAlfabeto[Math.floor((Math.random() * 27) + 1)]) +
            Math.floor((Math.random() * 900) + 100);
    }
}
