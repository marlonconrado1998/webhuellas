app.controller('usuarioController', usuarioController)

/** @ngInject */
usuarioController.$inject = ['principalService', '$location', 'swetService'];

function usuarioController(principalService, $location, swetService) {

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
    ctrl.loadingSolicitud = false;
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

            swetService.SWAL_INPUT(function (value) {
                if (!value) return "Introduce el código que enviamos a tu correo.";
                if (value !== ctrl.code) return "Código incorrecto.";
            }, function () {
                return principalService.registrarPersona(datos).then(function (response) {
                    if (response.code === "ERROR") {
                        throw new Error('¡Usuario ya existe!')
                    }
                    return response;
                }).catch(function (error) {
                    swal.showValidationError(error);
                });
            }, function (result) {
                if (result) {
                    swetService.SWAL_SUCCESS('¡Felicitaciones!', 'Acabas de ser registrado.');
                }
            }, "Ingresa el código que enviamos a tu correo", "text");
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

        ctrl.code = generarCodigo();
        var msg = {
            name: "Fundacion huellas de amor",
            email: "customershuellas@gmail.com",
            subject: "Codigo de confirmacion de registro",
            body: plantilla + 'Aqui tiene tu codigo de confirmacion:  <strong>' + ctrl.code + '<strong></div>',
            to: ctrl.solicitud.correo
        }
        ctrl.solicitud.motivo_adopcion = ctrl.solicitud.motivo_adopcion.trim();

        if ((ctrl.solicitud.motivo_adopcion).trim().length > 10) {
            ctrl.loadingSolicitud = true;
            principalService.sendMensaje(msg).then(function () {
                ctrl.loadingSolicitud = false;
                $('#modalSolicitudAdopcion').modal('hide');
                swetService.SWAL_INPUT(function (text) {
                    if (!text) return "Este campo no puede estar vacío";
                    if (text !== ctrl.code) return "Código incorrecto";
                }, function () {

                    informacionPersona.motivo_adopcion = ctrl.solicitud.motivo_adopcion;
                    ctrl.solicitud.actualizar = !angular.equals(ctrl.solicitud, informacionPersona);

                    return principalService.realizarSolicitud(ctrl.solicitud).then(function (response) {
                        if (response.data.error) {
                            swal.showValidationError(response.data.error + ' No se puede realizar la solicitud.');
                        } else {
                            return true;
                        }
                    }).catch(function (error) {
                        swal.showValidationError("Error al completar la solicitud.");
                    });
                }, function (success) {
                    if (success) {
                        swetService.SWAL_SUCCESS('¡Solicitud registrada!', "<p>Tu solicitud acaba de ser registrada. Dentro de 8 dias habiles le daremos respuesta a traves de correo o llamada.</p>");
                        ctrl.solicitud = {};
                        informacionPersona = {};
                        ctrl.informacionAnimal = {};
                    }
                }, 'Introduce el código que enviamos a tu correo.', "text");

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

    function generarCodigo() {
        var arrAlfabeto = alfabeto.split(",");
        return (arrAlfabeto[Math.floor((Math.random() * 27) + 1)]) +
            (arrAlfabeto[Math.floor((Math.random() * 27) + 1)]) +
            Math.floor((Math.random() * 900) + 100);
    }
}
