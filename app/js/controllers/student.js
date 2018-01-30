'use strict';

function StudentController(StudentService, $q) {
  'ngInject';
  // ViewModel
  const vm = this;
  vm.students = [];
  vm.pages = 0;
  vm.perPage = 100;
  vm.range = [];
  vm.activePage = 0;
  vm.focusedStudent = {};
  vm.studentForm = {};
  vm.dir = -1;
  vm.filter = '';
  vm.order = '';

  vm.setFocusedStudent = id =>{
   vm.focusedStudent = vm.getStudentById(id);};

  vm.edit = () => {
    let promise = vm.updateStudent(vm.focusedStudent);
    promise.then(() => {
      Materialize.toast('Estudiante editado exitosamente',5000);
      vm.loadStudents();
    });
    promise.catch(() => {
      Materialize.toast('Error al editar estudiante',5000);
      vm.loadStudents();
    });
  };

  vm.delete = () => {
    let promise = vm.deleteById(vm.focusedStudent.id);
    promise.then(() => {
      Materialize.toast('Estudiante eliminado exitosamente', 5000);
      vm.loadStudents();
    });
    promise.catch(() => {
      Materialize.toast('Error al eliminar estudiante', 5000);
      vm.loadStudents();
    });
  };

  vm.updateStudent = (student) => StudentService.updateStudent(student);
  vm.deleteById = id => StudentService.deleteById(id);
  vm.getSortedStudents = (limit, skip, filter, prop, dir) => { return StudentService.sortStudents(limit, skip, filter, prop, dir); };

  vm.getStudentById = id => {
    for (let i = 0; i < vm.students.length; ++i)
      if(vm.students[i].id == id) {
          let student = vm.students[i];
          console.log(student);
          return  {
            id: student.id,
            names: student.names,
            email: student.email,
            phone: student.phone,
            card_number: student.card_number,
            account_number: student.account_number
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

  vm.getStudents = (page) => {
    let skip = page * vm.perPage,
        limit = vm.perPage;
    return StudentService.getStudents(limit, skip, vm.filter);
  };

  vm.loadStudents = () => {

    if(vm.order !== '')
      vm.sortStudents(vm.order, true);
    else
      vm.getStudents(vm.activePage).then(response => { vm.students = response.data;});
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
    vm.loadStudents();
  };

  vm.handlePageIndexClick = (event) => {
    vm.activePage = event.currentTarget.attributes['data-index'].value;
    vm.loadStudents();
  };

  vm.getStudentCount = () => StudentService.countStudents();
  vm.postStudent = (student) => StudentService.postStudent(student);

  vm.sortStudents = (prop, keepdirection) => {
    if(!prop)
      vm.loadStudents();

    let skip = vm.activePage * vm.perPage,
      limit = vm.perPage;
    if(!keepdirection)
      vm.dir *= -1;
    vm.order = prop;
    let direction = vm.dir === 1 ? 'ASC' : 'DESC';
    vm.getSortedStudents(limit, skip, vm.filter, vm.order, direction).then(response => vm.students = response.data);


    $('#sort-icon').remove();
    let icon = `<i id="sort-icon" class="material-icons"> ${vm.dir === 1 ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>`;
    $(`#${vm.order}-header`).append(icon);

  };

  vm.searchStudents = () => {
    if(`${vm.search}` === '' || `${vm.search}` === 'undefined' || `${vm.search}` === undefined) {
      vm.filter = '';
      vm.loadStudents();
      return;
    }

    let regexp = `/.*${`${vm.search}`.split(' ').join('[ a-zA-Z ]*')}.*/i`;
    let or =
    [
      { names: {regexp}},
      { phone: {regexp}},
      { card_number: {regexp}},
      { account_number: {regexp}},
      { email: {regexp}}
    ];
    vm.filter = {or};
    let promise = StudentService.getStudents(vm.perPage,vm.perPage*vm.activePage,{or});
    promise.then( response =>  vm.students = response.data);
    promise.catch( () => Materialize.toast('Error al realizar busqueda', 5000));
  };

  vm.submitStudent = () => {
    let { account_number, card_number, names, email, phone } = vm.post;
    let student = {
      names: names,
      phone: phone,
      card_number: card_number,
      account_number: account_number,
      email: email
    };

    let promise = vm.postStudent(student);
    promise.then(() => {
      Materialize.toast('Estudiante agregado exitosamente', 5000);
      vm.loadStudents();
    });
    promise.catch(() => {
      Materialize.toast('Error al agregar estudiante', 5000);
      vm.loadStudents();
    });
    vm.post = {};
  };

  let getCount   = vm.getStudentCount(),
  getStudents = vm.getStudents(0);


  $q.all([getCount, getStudents]).then( responses => {
    let { count } = responses[0].data;
    vm.pages = Math.ceil(count/vm.perPage);
    vm.range = [];

    for (let i = 0; i < vm.pages; i++)
      vm.range.push(i);

    vm.students = responses[1].data;
  });
}
export default {
  name: 'StudentController',
  fn: StudentController
  };
