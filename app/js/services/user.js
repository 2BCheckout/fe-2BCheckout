'use strict';

import  { apiUrl } from '../constants';

function UserService($http) {
  'ngInject';

  const service = {};

  // credentials: { email, passowrd }
  service.login = credentials => $http.post(`${apiUrl}UserAccounts/login`, credentials);

  service.getUserById = id => $http.get(`${apiUrl}UserAccounts/${id}`, id);

  service.logout = () => $http.post(`${apiUrl}UserAccounts/logout`);

  service.countUsers = () => $http.get(`${apiUrl}UserAccounts/count`);

  service.getUsers = filter => {
    if(!filter)
      return $http.get(`${apiUrl}UserAccounts?filter[include]=roles`);
    return $http.get(`${apiUrl}UserAccounts?filter[include]=roles&filter=${JSON.stringify(filter)}`);
  }

  service.getRoles = () => {return ['movil', 'cajero', 'admin'];}

  service.postUser = (user) => $http.post(`${apiUrl}UserAccounts`, user);
  service.updateUser = (user) => $http.put(`${apiUrl}UserAccounts/${user.id}`, user);
  service.activateUser = (email) => $http.post(`${apiUrl}UserAccounts/activate?email=${email}`);
  service.desactivateUser = (email) => $http.post(`${apiUrl}UserAccounts/desactivate?email=${email}`);
  service.deleteById = id => $http.delete(`${apiUrl}UserAccounts/${id}`);

  return service;
}

export default {
  name: 'UserService',
  fn: UserService
};
