app.controller('contactController', contactController)

/** @ngInject */
contactController.$inject = ['principalService', '$location'];

function contactController(principalService) {

    var contact = this;
    contact.loadingMsg = false;

    contact.onSendMensaje = function () {
        contact.loadingMsg = true;
        principalService.sendMensaje(contact.msg).then(function(resp){
            if (resp) {
                contact.loadingMsg = false;
                toaster("success", "Mensaje enviado correctamente", 5000);
            }
        }).catch(function (error) {
            toaster("warning", "Error al enviar el mensaje", 5000);
        });
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