import  { apiUrl } from '../constants';

function ClientService($http) {
  'ngInject';

  const service = {};

  service.countClients = () => $http.get(`${apiUrl}clientes/count`);

  service.getClients = (limit, skip, filter) => {
    if(filter === '' || !filter)
      return $http.get(`${apiUrl}clientes?filter[limit]=${limit}&filter[skip]=${skip}`);
    return $http.get(`${apiUrl}clientes?filter=${JSON.stringify(filter)}&filter[limit]=${limit}&filter[skip]=${skip}`);
  }

  service.postClient = (client) => $http.post(`${apiUrl}clientes/`, client);
  service.deleteById = id => $http.delete(`${apiUrl}clientes/${id}`);

  service.sortClients = (limit, skip, filter, prop, dir) => {
    if(filter === '' || !filter)
      return $http.get(`${apiUrl}clientes?filter[limit]=${limit}&filter[skip]=${skip}&filter[order]=${prop} ${dir}`);
    return $http.get(`${apiUrl}clientes?filter=${JSON.stringify(filter)}&filter[limit]=${limit}&filter[skip]=${skip}&filter[order]=${prop} ${dir}`);
  };
  service.updateClient = (client) => $http.patch(`${apiUrl}clientes/`, client);
  service.getClientById = id => $http.get(`${apiUrl}clientes/${id}`);
  service.getCards = id => $http.get(`${apiUrl}clientes/${id}/tarjetas`);
  return service;
}

export default {
  name: 'ClientService',
  fn: ClientService
};
