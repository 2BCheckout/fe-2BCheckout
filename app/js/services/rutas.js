'use strict';

import { apiUrl } from '../constants';

function RutasService($http) {
	'ngInject';

	const service = {};

	service.countRutas = () => $http.get(`${apiUrl}routes/count`);
	service.postRuta = (rutas) => $http.post(`${apiUrl}routes/`, rutas);
	service.putRuta = (id,ruta) => $http.put(`${apiUrl}routes/${id}`, ruta);
	service.deleteById = id => $http.delete(`${apiUrl}routes/${id}`);

	service.getRutas = filter => {
    if(!filter)
			return $http.get(`${apiUrl}routes`);
    return $http.get(`${apiUrl}routes?filter=${JSON.stringify(filter)}`);
  }



  return service;
}

export default {
	name: 'RutasService',
	fn: RutasService
}
