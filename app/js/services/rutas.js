'use strict';

import { apiUrl } from '../constants';

function RutasService($http) {
	'ngInject';

	const service = {};

	service.countRutas = () => $http.get(`${apiUrl}rutas/count`);
	service.postRuta = (rutas) => $http.post(`${apiUrl}rutas/`, rutas);
	service.putRuta = (id,ruta) => $http.put(`${apiUrl}rutas/${id}`, ruta);
	service.deleteById = id => $http.delete(`${apiUrl}rutas/${id}`);

	service.getRutas = filter => {
    if(!filter)
      return $http.get(`${apiUrl}rutas`);
    return $http.get(`${apiUrl}rutas?filter=${JSON.stringify(filter)}`);
  }



  return service;
}

export default {
	name: 'RutasService',
	fn: RutasService
}
