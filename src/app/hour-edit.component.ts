import {Component, OnInit, Output, EventEmitter, OnChanges} from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { ViewModelService } from '../shared/view-model.service';
import { kv, LocationModel, StaffHourEditModel, StaffHeaderModel, validationHour, StaffHeaderView} from "../shared/my-models";
import { WebApiService } from "../shared/web-api.service";

//import * as wjInput from 'wijmo/wijmo.angular2.input';

@Component({
  moduleId: module.id,

  selector: 'hour-edit',
  templateUrl: 'hour-edit.component.html'
})
export class HourEditComponent implements OnInit {
  hourEditForm: FormGroup;
  hourEditPlaceholder: string;

  hours: number[];
  minutes: string[];
  dayParts: string[];
  months: kv[];
  days: number[];
  hourEditModel: StaffHourEditModel;
  locations: LocationModel[];
  timeWorked: number;
  validationMessage: string;
  failedRecordNumber: number;
  isFutureDate: boolean;
  isPriorToMinEditDate: boolean;
  staffHeaderModels: StaffHeaderModel[];


  constructor(public viewmodel: ViewModelService,
    private service: WebApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {
    // let recordNo = Number.parseInt(route.snapshot.params['id']);
    this.hourEditModel = viewmodel.defaultHourEditModel;
    this.hourEditModel.RecordNo = Number.parseInt(route.snapshot.params['id']);

    this.getLocations();
    this.hours = viewmodel.GetHours();
    this.minutes = viewmodel.GetMinutes();
    this.dayParts = viewmodel.GetDayParts();
    this.months = viewmodel.GetMonths();
    this.days = viewmodel.GetDays();

    this.hourEditPlaceholder = "Staff Hour Edit Page";
    this.createForm();
    
  }

  ngOnInit() {
    // this.setFormValues();
    
    this.getHourEditModel(this.viewmodel.selectedGuardianID, this.hourEditModel.RecordNo);

  }

  createForm() {
    this.hourEditForm = this.fb.group({
        "RecordNo": '',
        "GuardianID": '',
        "DateYear": ['', [Validators.required, Validators.pattern('20[0-2][0-9]')]],
        "DateMonth": '',
        "DateDay": '',
        "TimeInHour": '7',
        "TimeInMinute": '00',
        "TimeInDayPart": 'AM',
        "TimeOutHour": '7',
        "TimeOutMinute": '00',
        "TimeOutDayPart": 'AM',
        "LocationID": ['', [this.locationValidator]],
        "Comment": ''
      }
    ), {validator: [this.timeWorkedValidator]};
  }

  setFormValues() {
    this.hourEditForm.setValue({
      RecordNo: this.hourEditModel.RecordNo,
      GuardianID: this.hourEditModel.GuardianID,
      LocationID: this.hourEditModel.LocationID,
      Comment: this.hourEditModel.Comment,

      DateYear: this.hourEditModel.DateYear,
      DateMonth: this.hourEditModel.DateMonth,
      DateDay: this.hourEditModel.DateDay,

      TimeInHour: this.hourEditModel.TimeInHour,
      TimeInMinute: this.hourEditModel.TimeInMinute,
      TimeInDayPart: this.hourEditModel.TimeInDayPart,
      TimeOutHour: this.hourEditModel.TimeOutHour,
      TimeOutMinute: this.hourEditModel.TimeOutMinute,
      TimeOutDayPart: this.hourEditModel.TimeOutDayPart
    });

  }
  updateModelValuesFromForm() {
    this.hourEditModel.RecordNo = this.hourEditForm.get('RecordNo').value;
    this.hourEditModel.GuardianID = this.hourEditForm.get('GuardianID').value;
    this.hourEditModel.DateYear = this.hourEditForm.get('DateYear').value;
    this.hourEditModel.DateMonth = this.hourEditForm.get('DateMonth').value;
    this.hourEditModel.DateDay = this.hourEditForm.get('DateDay').value;
    this.hourEditModel.TimeInHour = this.hourEditForm.get('TimeInHour').value;
    this.hourEditModel.TimeInMinute = this.hourEditForm.get('TimeInMinute').value;
    this.hourEditModel.TimeInDayPart = this.hourEditForm.get('TimeInDayPart').value;
    this.hourEditModel.TimeOutHour = this.hourEditForm.get('TimeOutHour').value;
    this.hourEditModel.TimeOutMinute = this.hourEditForm.get('TimeOutMinute').value;
    this.hourEditModel.TimeOutDayPart = this.hourEditForm.get('TimeOutDayPart').value;
    this.hourEditModel.LocationID = this.hourEditForm.get('LocationID').value;
    this.hourEditModel.Comment = this.hourEditForm.get('Comment').value;
    
    //this.hourEditModel.ModifiedBy = this.viewmodel.staffHeaderView.GuardianID;
    this.viewmodel.selectedGuardianID = this.hourEditModel.GuardianID;
  }

  getLocations() {
    this.service.getLocations().subscribe(result => {
      this.locations = result;
    }, error2 => console.log(error2));
  }


  getHourEditModel(guardianId: number, recordNumber: number) {
    console.log(guardianId);
    this.service.getStaffHourEditModel(guardianId, recordNumber)
      .subscribe(result => {
        this.hourEditModel = result;

        this.setFormValues();
        this.getTimeWorked();

      }, error2 => {
        return console.log(error2);
      });

  }


  onSubmit() {
    this.updateModelValuesFromForm();
    this.putStaffHour()
  }



  private putStaffHour() {
    if (!(this.failedRecordNumber>0))
      this.service.putStaffHour(this.hourEditModel)
        .subscribe(result => {
          this.navigateToHoursList();
        }, error2 => console.log(error2) );
  }




  navigateToHoursList() {
    this.router.navigate(['hours-list'])
  }

  onFormChanges(){
     this.hourEditModel.ModifiedBy = this.viewmodel.staffHeaderView.GuardianID;
     
     this.getTimeWorked();

     this.isFutureDate = this.getIsFutureDate();

     this.isPriorToMinEditDate =
       this.viewmodel.getDateIsPriorToMinEditDate(
         +this.hourEditForm.get('DateYear').value,
         +this.hourEditForm.get('DateMonth').value - 1,
         +this.hourEditForm.get('DateDay').value);

     let hour = <StaffHourEditModel>{
       RecordNo: +this.hourEditForm.get('RecordNo').value,
       GuardianID: +this.hourEditForm.get('GuardianID').value,
        DateYear: +this.hourEditForm.get('DateYear').value,
        DateMonth: +this.hourEditForm.get('DateMonth').value,
        DateDay: +this.hourEditForm.get('DateDay').value,
        TimeInHour: +this.hourEditForm.get('TimeInHour').value,
        TimeInMinute: +this.hourEditForm.get('TimeInMinute').value,
        TimeInDayPart: this.hourEditForm.get('TimeInDayPart').value,
        TimeOutHour: +this.hourEditForm.get('TimeOutHour').value,
        TimeOutMinute: +this.hourEditForm.get('TimeOutMinute').value,
        TimeOutDayPart: this.hourEditForm.get('TimeOutDayPart').value,
        LocationID: +this.hourEditForm.get('LocationID').value
     }
     this.preValidateConflict(hour);
     console.log(this.hourEditModel.ModifiedBy); 
  }

  preValidateConflict(hour: StaffHourEditModel){
    this.service.checkRecordConflict(hour).subscribe(
      result=> {
        this.failedRecordNumber = result;
      }
    )
  }

  getTimeWorked() {
    this.timeWorked = (this.viewmodel.getMinuteOfDay(parseInt(this.hourEditForm.get('TimeOutHour').value),
        parseInt(this.hourEditForm.get('TimeOutMinute').value),
        this.hourEditForm.get('TimeOutDayPart').value) -
      this.viewmodel.getMinuteOfDay(parseInt(this.hourEditForm.get('TimeInHour').value),
        parseInt(this.hourEditForm.get('TimeInMinute').value),
        this.hourEditForm.get('TimeInDayPart').value)) /
      60.00
  }

  dateValidator(): any  {
    return null;
  }

  getIsFutureDate(): boolean {
    let today = new Date();
    let recordDate = new Date(this.hourEditForm.get('DateYear').value, this.hourEditForm.get('DateMonth').value-1, this.hourEditForm.get('DateDay').value);
    return recordDate > today;
  }

  locationValidator(ctl: FormControl):any{
    return +ctl.value > 0 ? null : {location: true};
  }

  timeWorkedValidator(frm: FormGroup): any{
    return (this.viewmodel.getMinuteOfDay(+frm.get('TimeOutHour').value, +frm.get('TimeOutMinute').value, frm.get('TimeOutDayPart').value)
      - (this.viewmodel.getMinuteOfDay(+frm.get('TimeInHour').value, +frm.get('TimeInMinute').value, frm.get('TimeInDayPart').value))
      >= 0 ? null: {timeWorked: true});
    //return this.timeWorked >= 0 ? null : {timeWorked: true};
  }

 
}
