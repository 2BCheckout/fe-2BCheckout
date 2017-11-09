'use strict';

function UsersController(UserService, $q) {
  'ngInject';
  // ViewModel
  const vm = this;
  vm.users = [];
  vm.pages = 0;
  vm.perPage = 100;
  vm.range = [];
  vm.activePage = 0;
  vm.focusedUser = {};
  vm.userForm = {};
  vm.roles = UserService.getRoles();
  console.log(vm.roles);

  vm.getFullName = (user) => {
    return user.firstName + ' ' + user.firstSurname;
  };

  vm.setFocusedUser = id => vm.focusedUser = vm.getUserById(id);

  vm.edit = () => {
    let promise = vm.updateUser(vm.focusedUser);
    promise.then(() => {
      Materialize.toast('Usuario editado exitosamente',5000);
      vm.loadUsers();
    });
    promise.catch(() => {
      Materialize.toast('Error al editar usuario',5000);
      vm.loadUsers();
    });
  }

  vm.delete = () => {
    let promise = vm.deleteById(vm.focusedUser.id);
    promise.then(() => {
      Materialize.toast('Usuario eliminado exitosamente', 5000);
      vm.loadUsers();
    });
    promise.catch(() => {
      Materialize.toast('Error al eliminar usuario', 5000);
      vm.loadUsers();
    });
  }

  vm.deleteById = id => UserService.deleteById(id);

  vm.getUserById = id => {
    for (let i = 0; i < vm.users.length; ++i)
      if(vm.users[i].id == id) {
          let user = vm.users[i];
          console.log(user)
          return  {
            id: user.id,
            firstName: user.firstName,
            secondName: user.secondName,
            firstSurname: user.firstSurname,
            secondSurname: user.secondSurname,
            email: user.email,
            type: user.roles[0].name,
            username: user.username
          }
      }
  }

  vm.getUsers = (page) => {
    let skip = page * vm.perPage,
        limit = vm.perPage;
    return UserService.getUsers({limit,skip});
  };

  vm.loadUsers = () =>  vm.getUsers(vm.activePage)
  .then(response => vm.users = response.data);

  vm.handlePageControlClick = (event) => {
    let active = event.currentTarget.attributes['data-control'].value;
    if(active.toLowerCase() === 'false')
    return;

    let control = event.currentTarget.attributes['data-control'].value;
    let page = parseInt(vm.activePage);
    vm.activePage = control === 'foward' ? page + 1 : page - 1;
    vm.loadUsers();
  }

  vm.handlePageIndexClick = (event) => {
    vm.activePage = event.currentTarget.attributes['data-index'].value;
    vm.loadUsers();
  }

  vm.getUserCount = () => UserService.countUsers();
  vm.postUser = (user) => UserService.postUser(user);
  vm.updateUser = (user) => UserService.updateUser(user);

  vm.changeUserState = (user) => {
    let change = (user.status == 'active')?'desactivado':'activado';
    let callFunc = (user.status == 'active')?vm.desactivateUser:vm.activateUser;

    let promise = callFunc(user.email)

    promise.then(() => {
      Materialize.toast('Usuario '+change+' exitosamente', 5000);
      vm.loadUsers();
    })

    promise.catch(() => {
      Materialize.toast('Usuario no pudo ser '+change, 5000);
      vm.loadUsers();
    })
  }

  vm.activateUser = (email) => UserService.activateUser(email)
  vm.desactivateUser = (email) => UserService.desactivateUser(email)

  vm.submitUser = () => {
    let { firstname, middlename, lastname, secondLastname, email, rol, newPassword, newUsername } = vm.post;
    let user = {
      firstName: firstname,
      secondName: middlename ? middlename : '',
      firstSurname: lastname,
      secondSurname: secondLastname ? secondLastname : '',
      email: email,
      type: rol,
      emailVerified: true,
      status: 'desactive',
      password:newPassword,
      username: newUsername
    };

    console.log(JSON.stringify(user))

    let promise = vm.postUser(user);
    promise.then(() => {
      Materialize.toast('Usuario agregado exitosamente', 5000);
      vm.loadUsers();
    });
    promise.catch(() => {
      Materialize.toast('Error al agregar usuario', 5000);
      vm.loadUsers();
    });
    vm.post = {};
  }

  let getCount   = vm.getUserCount(),
  getUsers = vm.getUsers(0);

  $q.all([getCount, getUsers]).then( responses => {
    let { count } = responses[0].data;
    vm.pages = Math.ceil(count/vm.perPage);
    vm.range = [];

    for (let i = 0; i < vm.pages; i++)
      vm.range.push(i);

    vm.users = responses[1].data
  });
}

export default {
  name: 'UsersController',
  fn: UsersController
};
