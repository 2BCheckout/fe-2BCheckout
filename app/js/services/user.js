'use strict';

import  { apiUrl } from '../constants';

function UserService($http) {
  'ngInject';

  const service = {};

  // credentials: { email, passowrd }
  service.login = credentials => $http.post(`${apiUrl}Users/login`, credentials);

  service.getUserById = id => $http.get(`${apiUrl}Users/${id}`, id);

  service.logout = () => $http.post(`${apiUrl}Users/logout`);

  service.countUsers = () => $http.get(`${apiUrl}Users/count`);

  service.getUsers = filter => {
    if(!filter)
      return $http.get(`${apiUrl}Users?filter[include]=roles`);
    return $http.get(`${apiUrl}Users?filter[include]=roles&filter=${JSON.stringify(filter)}`);
  }

  service.getRoles = () => {return ['movil', 'cajero', 'admin'];}

  service.postUser = (user) => $http.post(`${apiUrl}Users`, user);
  service.updateUser = (user) => $http.put(`${apiUrl}Users/${user.id}`, user);
  service.activateUser = (email) => $http.post(`${apiUrl}Users/activate?email=${email}`);
  service.desactivateUser = (email) => $http.post(`${apiUrl}Users/desactivate?email=${email}`);
  service.deleteById = id => $http.delete(`${apiUrl}Users/${id}`);

  return service;
}

export default {
  name: 'UserService',
  fn: UserService
};
