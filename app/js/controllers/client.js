'use strict';

function ClientController(ClientService, $q) {
  'ngInject';
  // ViewModel
  const vm = this;
  vm.clients = [];
  vm.pages = 0;
  vm.perPage = 100;
  vm.range = [];
  vm.activePage = 0;
  vm.focusedClient = {};
  vm.clientForm = {};
  vm.dir = -1;
  vm.filter = '';
  vm.order = '';

  vm.setFocusedClient = id =>{
   vm.focusedClient = vm.getClientById(id);};

  vm.edit = () => {
    let promise = vm.updateClient(vm.focusedClient);
    promise.then(() => {
      Materialize.toast('Cliente editado exitosamente',5000);
      vm.loadClients();
    });
    promise.catch(() => {
      Materialize.toast('Error al editar cliente',5000);
      vm.loadClients();
    });
  };

  vm.delete = () => {
    let promise = vm.deleteById(vm.focusedClient.idCliente);
    promise.then(() => {
      Materialize.toast('Cliente eliminado exitosamente', 5000);
      vm.loadClients();
    });
    promise.catch(() => {
      Materialize.toast('Error al eliminar cliente', 5000);
      vm.loadClients();
    });
  };

  vm.updateClient = (client) => ClientService.updateClient(client);
  vm.deleteById = id => ClientService.deleteById(id);
  vm.getSortedClients = (limit, skip, filter, prop, dir) => { return ClientService.sortClients(limit, skip, filter, prop, dir); };

  vm.getClientById = id => {
    for (let i = 0; i < vm.clients.length; ++i)
      if(vm.clients[i].idCliente == id) {
          let client = vm.clients[i];
          console.log(client);
          return  {
            idCliente: client.idCliente,
            identidad: client.identidad,
            nombres: client.nombres,
            colonia: client.colonia,
            telefono: client.telefono
          }
      }
  };

 vm.getServiceById = (id) => {
      for (let i = 0; i < vm.services.length; ++i)
        if(vm.services[i].id == id) {
            let service = vm.services[i];
            return  {
                  'id': service.id,
                  'nombre': service.nombre,
                  'creado_por': service.creado_por
            }
        }
  };

  vm.handleAgregarModal = () => {
      setTimeout(function() {
      }, 100);

      setTimeout(function() {
        $('#agregar').modal('open');
      }, 100);
  };

  vm.getClients = (page) => {
    let skip = page * vm.perPage,
        limit = vm.perPage;
    return ClientService.getClients(limit,skip, vm.filter);
  };

  vm.loadClients = () => {

    if(vm.order !== '')
      vm.sortClients(vm.order, true);
    else
      vm.getClients(vm.activePage).then(response => { vm.clients = response.data;});
  };


  vm.handlePageControlClick = (event) => {
    console.log(event);
    let active = event.currentTarget.attributes['data-control'].value;
    console.log(active);
    if(active.toLowerCase() === 'false')
    return;

    let control = event.currentTarget.attributes['data-control'].value;
    let page = parseInt(vm.activePage);
    vm.activePage = control === 'foward' ? page + 1 >= vm.range.length-1 ? vm.range.length-1 : page + 1 : page - 1 <= 0 ? 0 : page - 1;
    vm.loadClients();
  };

  vm.handlePageIndexClick = (event) => {
    vm.activePage = event.currentTarget.attributes['data-index'].value;
    vm.loadClients();
  };

  vm.getClientCount = () => ClientService.countClients();
  vm.postClient = (client) => ClientService.postClient(client);

  vm.sortClients = (prop, keepdirection) => {
    if(!prop)
      vm.loadClients();

    let skip = vm.activePage * vm.perPage,
      limit = vm.perPage;
    if(!keepdirection)
      vm.dir *= -1;
    vm.order = prop;
    let direction = vm.dir === 1 ? 'ASC' : 'DESC';
    vm.getSortedClients(limit, skip, vm.filter, vm.order, direction).then(response => vm.clients = response.data);


    $('#sort-icon').remove();
    let icon = `<i id="sort-icon" class="material-icons"> ${vm.dir === 1 ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>`;
    $(`#${vm.order}-header`).append(icon);

  };

  vm.searchClients = () => {
    if(`${vm.search}` === '' || `${vm.search}` === 'undefined' || `${vm.search}` === undefined) {
      vm.filter = '';
      vm.loadClients();
      return;
    }

    let regexp = `${vm.search}`.split(' ').join('[ a-zA-Z ]*');
    let or =
    [
      { idCliente: {regexp}},
      { nombres: {regexp}},
      { telefono: {regexp}},
      { identidad: {regexp}},
      { colonia: {regexp}}
    ];
    vm.filter = {or};
    let promise = ClientService.getClients(vm.perPage,vm.perPage*vm.page,{or});
    promise.then( response =>  vm.clients = response.data);
    promise.catch( () => Materialize.toast('Error al realizar busqueda', 5000));
  };

  vm.submitClient = () => {
    let {identity, name, address, phone } = vm.post;
    let client = {
      nombres: name,
      telefono: phone,
      identidad: identity,
      colonia: address
    };

    let promise = vm.postClient(client);
    promise.then(() => {
      Materialize.toast('Cliente agregado exitosamente', 5000);
      vm.loadClients();
    });
    promise.catch(() => {
      Materialize.toast('Error al agregar cliente', 5000);
      vm.loadClients();
    });
    vm.post = {};
  };

  let getCount   = vm.getClientCount(),
  getClients = vm.getClients(0);


  $q.all([getCount, getClients]).then( responses => {
    let { count } = responses[0].data;
    vm.pages = Math.ceil(count/vm.perPage);
    vm.range = [];

    for (let i = 0; i < vm.pages; i++)
      vm.range.push(i);

    vm.clients = responses[1].data;
  });
}
export default {
  name: 'ClientController',
  fn: ClientController
  };
