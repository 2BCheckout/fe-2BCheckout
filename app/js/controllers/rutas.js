'use strict';

function RutasController (RutasService, $q) {
  'ngInject';

  const vm = this;
  vm.rutas = [];
  vm.pages = 0;
  vm.perPage = 100;
  vm.range = [];
  vm.activePage = 0;
  vm.focusedRoute = {};
  vm.buttonText = 'Salir';

  vm.nombre = '';
  vm.descripcion = '';

  vm.setFocusedRoute = id => vm.focusedRoute = vm.getRouteById(id);

  vm.edit = () => {
    let promise = vm.putRuta(vm.focusedRoute);
    promise.then(() => {
      Materialize.toast('Ruta editada exitosamente', 5000);
      vm.loadRutas();
    });
    promise.catch(() => {
      Materialize.toast('Error al editar ruta', 5000);
      vm.loadRutas();
    });
  }

  vm.delete = () => {
    console.log(vm.focusedRoute);
    let promise = vm.deleteById(vm.focusedRoute.idRuta);
    promise.then(() => {
      Materialize.toast('Ruta eliminada exitosamente', 5000);
      vm.loadRutas();
    });
    promise.catch(() => {
      Materialize.toast('Error al eliminar ruta', 5000);
      vm.loadRutas();
    });
  }

  vm.deleteById = id => RutasService.deleteById(id);

  vm.getRouteById = id => {
    for (let i = 0; i < vm.rutas.length; ++i)
      if(vm.rutas[i].idRuta == id) {
          let ruta = vm.rutas[i];
          return {
            idRuta: ruta.idRuta,
            nombre: ruta.nombre,
            descripcion: ruta.descripcion,
            costo: ruta.costo
          }
      }
  }

  vm.getRutas = (page) => {
    let skip = page * vm.perPage,
      limit = vm.perPage;
  return RutasService.getRutas({ limit, skip });
  }

  vm.loadRutas = () =>  vm.getRutas(vm.activePage)
    .then(response => vm.rutas = response.data);

  vm.handlePageControlClick = (event) => {
    let active = event.currentTarget.attributes['data-control'].value;
    if(active.toLowerCase() === 'false')
    return;

    let control = event.currentTarget.attributes['data-control'].value;
    let page = parseInt(vm.activePage);
    vm.activePage = control === 'foward' ? page + 1 : page - 1;
    vm.loadRutas();
  }

  vm.handlePageIndexClick = (event) => {
    vm.activePage = event.currentTarget.attributes['data-index'].value;
    vm.loadRutas();
  }

  vm.getRutasCount = () => RutasService.countRutas();
  vm.postRuta = (ruta) => RutasService.postRuta(ruta);
  vm.putRuta = (ruta) => RutasService.putRuta(ruta.idRuta, ruta);

  vm.searchRutas = () => {
    let regexp = `/${vm.search}/`;
    let where =
    { or :
      [
        { nombre: { regexp } },
        { descripcion: { regexp } }
      ]
    };
    let promise = RutasService.getRutas({where});
    promise.then(response => vm.rutas = response.data);
    promise.catch( () => Materialize.toast('Error al realizar busqueda', 5000));
  };

  vm.submitRuta = () => {
      let { name, description, costo } = vm.post;
      let ruta = {
        nombre: name,
        descripcion: description,
        costo: costo
      };

      console.log(ruta);

      let promise = vm.postRuta(ruta);
      promise.then(() => {
        Materialize.toast('Ruta agregada exitosamente', 5000);
        vm.loadRutas();
      });
      promise.catch(() => {
        Materialize.toast('Error al agregar ruta', 5000);
        vm.loadRutas();
      });
      vm.post = {};
    }

    let getCount   = vm.getRutasCount(),
    getRutas = vm.getRutas(0);

    $q.all([getCount, getRutas]).then( responses => {
      let { count } = responses[0].data;
      vm.pages = Math.ceil(count/vm.perPage);
      vm.range = [];

      for (let i = 0; i < vm.pages; i++)
      vm.range.push(i);

      vm.rutas = responses[1].data;
  });
}


export default {
  name: 'RutasController',
  fn: RutasController
};
