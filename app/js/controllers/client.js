'use strict';

function ClientController(ClientService, ServicesService, $q) {
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
  vm.services = [];


  vm.getFullName = (client) => {
    let fullname = '';
    let keys = Object.keys(client);
    for (var i = 1; i < 5; ++i)
      fullname += [client[keys[i]]] + ' ';
    return fullname;
  };

  vm.setFocusedClient = id =>{
  console.log(id, vm.getClientById(id), vm.focusedClient);
   vm.focusedClient = vm.getClientById(id);};

  vm.edit = () => {
    let promise = vm.postClient(vm.focusedClient);
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

  vm.deleteById = id => ClientService.deleteById(id);

  vm.getClientById = id => {
    for (let i = 0; i < vm.clients.length; ++i)
      if(vm.clients[i].id_cliente == id) {
          let client = vm.clients[i];
          console.log(client);
          return  {
            idCliente: client.id_cliente,
            identidad: client.identidad,
            nombres: client.nombres,
            colonia: client.colonia,
            equipoServicio: client.id_servidor,
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

  vm.getServices = () => {
        return ServicesService.getServices();
  };

  vm.loadServices = () => {
   vm.getServices()
    .then(response => {
      vm.services = response.data;
    });

  };

  vm.handleAgregarModal = () => {
      vm.loadServices();

      setTimeout(function() {
      }, 100);

      setTimeout(function() {
        $('#agregar').modal('open');
      }, 100);
  };

  vm.getClients = (page) => {
    let skip = page * vm.perPage,
        limit = vm.perPage;
    return ClientService.getClientsWithEquipoServicio(limit,skip,null);
  };

  vm.loadClients = () =>  vm.getClients(vm.activePage)
  .then(response => {
    vm.clients = response.data;
  });


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

  vm.searchClients = () => {
    let regexp = `${vm.search}`;
    let or =
    [
      { idCliente: {regexp}},
      { nombres: {regexp}},
      { telefono: {regexp}},
      { idServidor: {regexp}},
      { identidad: {regexp}},
      { colonia: {regexp}}
    ];
    let promise = ClientService.getClientsWithEquipoServicio(vm.perPage,vm.perPage*vm.page,{or});
    promise.then( response =>  vm.clients = response.data);
    promise.catch( () => Materialize.toast('Error al realizar busqueda', 5000));
  };

  vm.submitClient = () => {
    let {identity, name, address, phone, service } = vm.post;
    let client = {
      nombres: name,
      telefono: phone,
      id_servidor: service==='' ? null:service,
      identidad: identity,
      colonia: address
    }

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
  }

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

  vm.loadServices();
}
export default {
  name: 'ClientController',
  fn: ClientController
  };
