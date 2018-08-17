app.config(["$stateProvider", "$urlRouterProvider", '$compileProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider) {

        // $compileProvider.debugInfoEnabled(false);

        $urlRouterProvider.otherwise("/Inicio");

        $stateProvider.state({
            name: '/Inicio',
            url: '/Inicio',
            templateUrl: 'pages/inicio.html'
        }).state({
            name: '/Gatos',
            url: '/Gatos',
            templateUrl: 'pages/cats.html'
        }).state({
            name: '/Perros',
            url: '/Perros',
            templateUrl: 'pages/dogs.html'
        }).state({
            name: '/Acerca',
            url: '/Acerca',
            templateUrl: 'pages/about.html'
        }).state({
            name: '/Contacto',
            url: '/Contacto',
            templateUrl: 'pages/contact.html'
        }).state({
            name: '/Adopciones',
            url: '/Adopciones',
            templateUrl: 'pages/volunteer.html'
        }).state({
            name: '/Registrarse',
            url: '/Registrarse',
            templateUrl: 'pages/singup.html'
        });
    }
]);