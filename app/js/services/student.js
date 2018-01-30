import  { apiUrl } from '../constants';

function StudentService($http) {
  'ngInject';

  const service = {};

  service.countStudents = () => $http.get(`${apiUrl}students/count`);

  service.getStudents = (limit, skip, filter) => {
    const filters = {where: filter, limit, skip}
    if(filter === '' || !filter)
      return $http.get(`${apiUrl}students?filter[limit]=${limit}&filter[skip]=${skip}`);
    return $http.get(`${apiUrl}students?filter=${JSON.stringify(filters)}`);
  }

  service.postStudent = (student) => $http.post(`${apiUrl}students/`, student);
  service.deleteById = id => $http.delete(`${apiUrl}students/${id}`);

  service.sortStudents = (limit, skip, filter, prop, dir) => {
    if(filter === '' || !filter)
      return $http.get(`${apiUrl}students?filter[limit]=${limit}&filter[skip]=${skip}&filter[order]=${prop} ${dir}`);
    return $http.get(`${apiUrl}students?filter=${JSON.stringify(filter)}&filter[limit]=${limit}&filter[skip]=${skip}&filter[order]=${prop} ${dir}`);
  };
  service.updateStudent = (student) => $http.patch(`${apiUrl}students/`, student);
  service.getStudentById = id => $http.get(`${apiUrl}students/${id}`);
  service.getCards = id => $http.get(`${apiUrl}students/${id}/tarjetas`);
  return service;
}

export default {
  name: 'StudentService',
  fn: StudentService
};
