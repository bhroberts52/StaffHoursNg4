import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewModelService } from '../shared/view-model.service';
import { Observable } from "rxjs";
import {StaffHourFacadeModel, StaffHeaderModel, StaffHourListModel} from "../shared/my-models";
import { WebApiService } from "../shared/web-api.service";
//import {error} from "selenium-webdriver";


@Component({
    moduleId: module.id,
    selector: 'hours-list',
    templateUrl: 'hours-list.component.html'
})
export class HoursListComponent implements OnInit {
    hoursListPlaceHolder: string;

    listHours: StaffHourListModel[];
    selectedHour: StaffHourListModel;
    hourCount: number = 0;
    totalHours: number = 0.0;
    errorMessage: any;
    minEditDate: Date;
    form: FormGroup;

    constructor(public viewmodel: ViewModelService, private service: WebApiService, private fb: FormBuilder, private router: Router ) {

    }

    ngOnInit() {
      this.minEditDate = this.viewmodel.minEditDate();

      this.hoursListPlaceHolder = "Hours List Page";
      this.buildForm();
      this.getStaffHourModels();
     }

    private buildForm() {
        this.form = this.fb.group({
            selectedGuardianID: this.viewmodel.selectedGuardianID,
            dateFrom: this.viewmodel.dateFrom.toISOString().substr(0, 10),
            dateTo: this.viewmodel.dateTo.toISOString().substr(0, 10)
        });
    }

     getStaffHourModels(){
         this.service.getStaffHourFacadeModels(+this.form.get('selectedGuardianID').value, this.form.get('dateFrom').value, this.form.get('dateTo').value)
           .subscribe(result=> {
           this.listHours = result.map(h=> this.viewmodel.getStaffListHour(h));
           this.hourCount = this.listHours.length;
           this.totalHours = this.listHours.map(h => h.Hour.TimeWorked).reduce((sum, current) => sum + current, 0);

          }, error => {this.errorMessage = error});
          }


      onFormChanges() {
          this.getStaffHourModels();
          this.updateViewmodelValues();
      }

      onSelectHour(hour: StaffHourListModel){
       this.selectedHour = hour;
      }

      editHour(hour: StaffHourListModel) {
          if(!hour.Hour.IsPaid)
            this.router.navigate(['hour-edit', hour.Hour.RecordNo]);
      }

      addHour() {
          this.router.navigate(['hour-edit', 0])
      }

      updateViewmodelValues() {
          this.viewmodel.selectedGuardianID = +this.form.get('selectedGuardianID').value;
          this.viewmodel.dateFrom = new Date(this.form.get('dateFrom').value);
          this.viewmodel.dateTo = new Date(this.form.get('dateTo').value);
      }

      deleteHour(hour: StaffHourListModel) {
          if (!hour.Hour.IsPaid) {
              this.listHours.splice(this.listHours.indexOf(hour),1);
              this.service.deleteStaffHour(hour.Hour.RecordNo)
                  .subscribe(result => {
                      console.log(result.toString());
                  });
          }
      }


}
