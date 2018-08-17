app.controller('contactController', contactController)

/** @ngInject */
contactController.$inject = ['principalService', '$location'];

function contactController(principalService) {

    var contact = this;
    contact.msg = {};

    contact.onSendMensaje = function () {
        principalService.sendMensaje(contact.msg).then(function(resp){
            if (resp) {
                alert("Mensaje enviado correctamente");
            }
        });
    }
}