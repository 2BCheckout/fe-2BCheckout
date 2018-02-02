'use strict';

class ReportGenerationController {

  constructor($state) {
    'ngInject';

    //default empty attribute value for /Viajes/getreports/filter{} :(
    this.defaultInitialDate = '0666-01-01';
    this.defaultValue = '';
    this.defaultFilterValue = '.*';
    this.initialDate = this.defaultValue;
    this.limitDate = this.defaultValue;
    this.busPlate = this.defaultValue;
    this.route = this.defaultValue;
    this.filter = null;
    this.$state = $state;
  }

  handleSubmit() {
    this.filter = null;
    if(!this.isValidDateInput()){
      Materialize.toast('Seleccione ambas fechas', 5000);
      return;
    }
    this.setFilter();

    console.log(this.filter);

    if(this.filter != null)
      this.$state.go('Report', {filter: JSON.stringify(this.filter)});
    else
      this.$state.go('Report');
  }

  setFilter() {

    this.initialDate = this.isSet(this.initialDate) ?
        this.getDateValue(new Date(this.initialDate)) : this.defaultInitialDate;

    this.limitDate =  this.isSet(this.limitDate) ?
        this.getDateValue(new Date(this.limitDate)) : this.getDateValue(new Date());

    this.initialDate += ' 00:00:00';
    this.limitDate += ' 23:59:59';

    this.filter = {
      'initial_date': this.initialDate,
      'final_date': this.limitDate
    };



    if(this.isAnySet())
    {
      this.route = this.getFilterValue(this.route);
      this.busPlate = this.getFilterValue(this.busPlate);
       this.filter.route = this.route;
       this.filter.bus_plate = this.busPlate;
    }
  }

  isAnySet() {
    return this.isSet(this.route)
        || this.isSet(this.busPlate);
  }

  getFilterValue(input) {
      return this.isSet(input) ? input : this.defaultFilterValue;
  }

  getDateValue(date) {
    let year = '' + date.getFullYear();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();

    if(day.length < 2)
      day = '0' + day;

    if(month.length < 2)
      month = '0' + month;

    return `${year}-${month}-${day}`;
  }

  isSet(input) {
    return input != this.defaultValue;
  }

  isValidDateInput() {
    return  !(this.isSet(this.initialDate) && !this.isSet(this.limitDate)
           || this.isSet(this.limitDate) && !this.isSet(this.initialDate))
  }
}

export default {
  name: 'ReportGenerationController',
  fn: ReportGenerationController
};
