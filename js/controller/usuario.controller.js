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
    ctrl.informacionAnimal = principalService.informacionAnimal;
    ctrl.loading = false;

    var informacionPersona = {};
    var contador_peticion_ciudades = 0;

    function getCities() {
        if (ctrl.ciudades.length == 0) {
            principalService.getCiudades()
                .then(function (response) {
                    if (response.data.length > 0) {
                        principalService.CIUDADES = response.data;
                        ctrl.ciudades = principalService.CIUDADES;
                    } else {
                        contador_peticion_ciudades += 1;
                        throw new Error();
                    }
                }).catch(function () {
                    if (contador_peticion_ciudades < 3) {
                        // getCities();
                    }
                });
        }
    }

    getCities();

    ctrl.registrarPersona = function (datos) {
        ctrl.loading = true;

        ctrl.code = generarCodigo();
        var msg = {
            name: "Fundacion huellas de amor",
            email: "customershuellas@gmail.com",
            subject: "Codigo de confirmacion de registro",
            body: plantilla + 'Este es tu codigo de confirmacion:  <strong>' + ctrl.code + '<strong></div><br><br><b><i>Luego de registrar el codigo, tu identificacion sera tu contraseña.</i></b>',
            to: datos.correo
        }

        principalService.sendMensaje(msg).then(function () {
            ctrl.loading = false;

            swetService.SWAL_INPUT(function (value) {
                if (!value) return "Introduce el código que enviamos a tu correo.";
                if (value !== ctrl.code) return "Código incorrecto.";
            }, function () {
                return principalService.registrarPersona(datos).then(function (response) {
                    if (typeof response != 'object') {
                        throw new Error();
                    }
                    if (response.code == "ERROR") {
                        swetService.TOASTER('error', response.message, 3500);
                        return false;
                    } else {
                        return response;
                    }
                }).catch(function (error) {
                    swal.showValidationError("Intentalo nuevamente...");
                });
            }, function (result) {
                if (result) {
                    swetService.SWAL_SUCCESS('¡Felicitaciones!', 'Acabas de ser registrado, tu contraseña será inicialmente tu identificación, la puedes cambuar cuando quieras.');
                    $location.path("/Inicio");
                }
            }, "Ingresa el código que enviamos a tu correo", "text");
        });
    }

    ctrl.solicitarAdopcion = function (id, correo, animal) {
        ctrl.loading = true;

        principalService.consultarPersona({ correo: correo, id: id }).then(function (response) {
            ctrl.loading = false;
            if (response.code === "ERROR") {
                swetService.TOASTER('error', response.message, 3500);
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
        }).catch(function () {
            ctrl.loading = false;
            swetService.TOASTER('warning', "Por favor intenta nuevamente.", 3500);
        });
    }

    ctrl.realizarSolicitud = function () {
        ctrl.code = generarCodigo();
        var msg = {
            name: "Fundacion huellas de amor",
            email: "customershuellas@gmail.com",
            subject: "Confirmacion de solicitud de adopcion.",
            body: '<div>' +
                '<center>' +
                '<h2>¡Hola, ' + ctrl.solicitud.nombre + ' ' + ctrl.solicitud.apellido + '!</h2>' +
                'Parece que te ha interesado solicitar uno de nuestros animales.<br><br>' +
                '</center>' + 'Con este codigo confirmas la solicitud de adopción:  <strong>' + ctrl.code + '<strong>', 
            to: ctrl.solicitud.correo
        }
        ctrl.solicitud.motivo_adopcion = ctrl.solicitud.motivo_adopcion.trim();

        if (ctrl.solicitud.motivo_adopcion.length > 10) {
            ctrl.loading = true;
            principalService.sendMensaje(msg).then(function () {
                ctrl.loading = false;
                $('#modalSolicitudAdopcion').modal('hide');
                swetService.SWAL_INPUT(function (text) {
                    if (!text) return "Este campo no puede estar vacío";
                    if (text !== ctrl.code) return "Código incorrecto";
                }, function () {

                    informacionPersona.motivo_adopcion = ctrl.solicitud.motivo_adopcion;
                    ctrl.solicitud.actualizar = !angular.equals(ctrl.solicitud, informacionPersona);

                    return principalService.realizarSolicitud(ctrl.solicitud).then(function (response) {
                        if (response.code == "ERROR") {
                            swal.showValidationError(response.message + ' No se puede realizar la solicitud.');
                        } else {
                            return true;
                        }
                    }).catch(function (error) {
                        swal.showValidationError("Hubo un problema, intenta nuevamente...");
                    });
                }, function (success) {
                    if (success) {
                        var msg = {
                            name: "Fundacion huellas de amor",
                            email: "customershuellas@gmail.com",
                            subject: "Confirmacion de solicitud de adopcion.",
                            body: '<div>' +
                                '<center>' +
                                '<h2>¡Está todo listo ' + ctrl.solicitud.nombre + '!</h2>' +
                                '<br>Dentro de 8 dias habiles a partir de ahora, nos estaremos comunicando contigo para darte una respuesta a tu solicitud.'+
                                '<br><br><i>!Gracias por tu solicitud!</i></div>',
                            to: ctrl.solicitud.correo
                        }
                        principalService.sendMensaje(msg).then(function () {
                            swetService.SWAL_SUCCESS('¡Solicitud registrada!', "<p>Tu solicitud acaba de ser registrada. Dentro de 8 dias habiles le daremos respuesta a traves de correo o llamada.</p>");
                            ctrl.solicitud = {};
                            informacionPersona = {};
                            ctrl.informacionAnimal = {};
                            $location.path("/Inicio");
                        });
                    }
                }, 'Introduce el código que enviamos a tu correo.', "text");

            });
        } else {
            swetService.TOASTER('warning', 'Escribe un motivo de adopcion mas explicito.', 5000);
        }
    }

    function generarCodigo() {
        var arrAlfabeto = alfabeto.split(",");
        return (arrAlfabeto[Math.floor((Math.random() * 27) + 1)]) +
            (arrAlfabeto[Math.floor((Math.random() * 27) + 1)]) +
            Math.floor((Math.random() * 900) + 100);
    }
}
