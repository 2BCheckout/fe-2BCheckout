import  { apiUrl } from '../constants';

class TripService {
  constructor($http) {
    'ngInject';
    this.$http = $http;
  }

  getCount() {
    return this.$http.get(`${apiUrl}rides/count`);
  }

  getTripsCount(filter) {
    if(!filter)
      return this.$http.get(`${apiUrl}rides/getReport/count`);
    return this.$http.get(`${apiUrl}rides/getReport/count?filter=${filter}`);
  }

  getTrips(skip,limit,filter) {
    if(!filter)
      return this.$http.get(`${apiUrl}rides/getReport?skip=${skip}&limit=${limit}`);
    return this.$http.get(`${apiUrl}rides/getReport?filter=${filter}&skip=${skip}&limit=${limit}`);
  }
}

export default {
  name: 'TripService',
  fn: TripService
};
