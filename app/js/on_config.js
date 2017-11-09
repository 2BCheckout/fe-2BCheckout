import customInterceptors from './interceptors/index';

function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider, $httpProvider, $qProvider) {
  'ngInject';

  $qProvider.errorOnUnhandledRejections(false);
  $httpProvider.interceptors.push(...customInterceptors);

  if (process.env.NODE_ENV === 'production')
    $compileProvider.debugInfoEnabled(false);

  $locationProvider.html5Mode(true);

  $stateProvider
  .state('Login', {
    url: '/',
    params: { redirected: false },
    controller: 'LoginController as ctrl',
    templateUrl: 'login.html',
    title: 'Login'
  })
  .state('ReportGeneration', {
    url: '/generacion-reporte',
    controller: 'ReportGenerationController as ctrl',
    templateUrl: 'report_generation.html',
    title: 'Reporte de viajes'
  })
  .state('Report', {
    url: '/reporte?filter',
    controller: 'ReportController as ctrl',
    templateUrl: 'report.html',
    title: 'Reporte de viajes'
  })
  .state('Client',{
    url: '/clientes',
    controller: 'ClientController as ctrl',
    templateUrl: 'cliente.html',
    title: 'Clientes',
  })
  .state('Rutas', {
    url: '/rutas',
    params: { redirected: false },
    controller: 'RutasController as ctrl',
    templateUrl: 'ruta.html',
    title: 'Rutas'
  })
  .state('Usuarios', {
    url: '/usuarios',
    params: { redirected: false },
    controller: 'UsersController as ctrl',
    templateUrl: 'usuarios.html',
    title: 'Usuarios'
  })
  .state('Cards', {
    url: '/clientes/:clientId/tarjetas',
    controller: 'CardController as ctrl',
    templateUrl: 'card.html',
    title: 'Tarjetas',
    resolve: {
      client: function($stateParams, ClientService) {
        'ngInject'
        let id = $stateParams.clientId;
        return ClientService.getClientById(id);
      },
      cards: function($stateParams, ClientService) {
        'ngInject'
        let id = $stateParams.clientId;
        return ClientService.getCards(id);
      }
    }})
   .state('dashboard', {
    url: '/dashboard',
    params: { redirected: false },
    controller: 'RutasController as ctrl',
    templateUrl: 'dashboard.html',
    title: 'dashboard'
  });
  $urlRouterProvider.otherwise('/');
}

export default OnConfig;
