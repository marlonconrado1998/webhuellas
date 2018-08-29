app.controller('contactController', contactController)

/** @ngInject */
contactController.$inject = ['principalService', 'swetService'];

function contactController(principalService, swetService) {

    var contact = this;
    contact.loadingMsg = false;

    contact.onSendMensaje = function () {
        swetService.SWAL_OPTION(function (response) {
            if (!response) return false;
            swetService.SWAL_SUCCESS("Mensaje enviado correctamente.");

        }, function (response) {
            // contact.loadingMsg = true;
            return principalService.sendMensaje(contact.msg).then(function (resp) {
                if (resp) {
                    return true;
                    // contact.loadingMsg = false;
                    // toaster("success", "Mensaje enviado correctamente", 5000);
                }
            }).catch(function (error) {
                swal.showValidationError("Error al enviar el mensaje.");
                // toaster("warning", "Error al enviar el mensaje", 5000);
            });
        });
    }
}