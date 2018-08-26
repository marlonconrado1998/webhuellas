var app = angular.module('app', [
    'ui.router'
]);

app.run(["$rootScope", "$location", "$anchorScroll", 
    function ($rootScope, $location, $anchorScroll) {
        $rootScope.$on("$locationChangeStart",
            function () {
                $location.hash("home");
                $anchorScroll();
            });
    }]);

// No muestra los mensajes de debug en la consola...
// app.config(Log);

// Log.$inject = ['$logProvider'];
// function Log($logProvider) {
//     console.log("LOG");
//     $logProvider.debugEnabled(false);
// }