'use strict';

import loginMaterialize from '../jQuery/views/login';

function LoginController(UserService, SessionService, $timeout, $state) {
  'ngInject';
  // ViewModel
  const vm = this;
  vm.username = '';
  vm.password = '';
  vm.loginFailed = false;
  vm.loading     = false;
  vm.errorMessage = $state.params.redirected ? 'Inicie sesión para continuar' : '';

  vm.login = (email, password) => {
    let credentials = {email, password};
    let promise = UserService.login(credentials);

    promise.then(response => {
      let { id, userId, ttl, rol, name } = response.data;
      if (rol==='admin') {
        SessionService.setSession({userId, email, accessToken: id, ttl, name, rol});
        vm.handleLoginSuccess();
      }else{
        vm.handleLoginFail('El rol no es valido!');
      }
    } );

    promise.catch(vm.handleLoginFail)
  };

  vm.handleLoginFail    = msg => vm.hideLoader(true, msg);
  vm.handleLoginSuccess = () => {
    vm.hideLoader(false);
  }

  vm.handleClick = (form) => {
    if (!form.$valid || vm.loading)
      return;

      vm.showLoader();
      vm.login(vm.username, vm.password);
  };

  vm.showLoader = () => {
    vm.errorMessage = '';
    vm.loginFailed  = false;
    vm.loading      = true;
  }

  vm.hideLoader = (loginFailed, msg = 'Correo o contraseña invalida') =>
      $timeout(() => {
        vm.loginFailed = loginFailed;
        vm.loading     = false;

        //TODO: redirect on login success
        if(!loginFailed)
          $state.go('dashboard');
        else
          vm.errorMessage = msg;
      }, 1250);

  loginMaterialize.init();
}

export default {
  name: 'LoginController',
  fn: LoginController
};
