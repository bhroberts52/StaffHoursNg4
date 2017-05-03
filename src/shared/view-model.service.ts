import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { WebApiService } from './web-api.service';
import {
  StaffHeaderModel, kv, StaffHourEditModel, StaffHourFacadeModel, StaffHourListModel,
  StaffHeaderView
} from './my-models';

@Injectable()
export class ViewModelService {

  //private defaultStaffHeaderModel: StaffHeaderModel = { GuardianID: 0, GuardianName: ''};
  //public staffHeaderModel: StaffHeaderModel = this.defaultStaffHeaderModel;
  private defaultStaffHeaderView: StaffHeaderView = {GuardianID: 0, GuardianName: '', Login: '', Pwd: '', PermissionID: 0}
  public staffHeaderView: StaffHeaderView = this.defaultStaffHeaderView;

  selectedGuardianID: number = 0;

  dateFrom = new Date();
  dateTo = new Date();

  //this seems unnecessary, doesnt solve problem in new Edge browser where staffHeaderModels become null when a new record is edited.
  private _staffHeaderModels: StaffHeaderModel[];
  get staffHeaderModels(): StaffHeaderModel[]{
    return this._staffHeaderModels;
  }
  set staffHeaderModels(val){
    this._staffHeaderModels = val;
  }

  constructor(public datasvc: WebApiService) {
      this.dateFrom.setDate(this.dateFrom.getDate() - 8);


  }

  public reset(){
     //this.staffHeaderModel = this.defaultStaffHeaderModel;
     this.staffHeaderView = this.defaultStaffHeaderView
  }

  private ListOfInts(min: number, max: number): number[] {

      let numArray: number[] = [];

      for (let i = min; i <= max; i++)
      {
          numArray.push(i);
      }
      return numArray;
  }

  public GetDays(): number[] {
      return this.ListOfInts(1, 31);
  }
  public GetHours(): number[] {
      return this.ListOfInts(1, 12);
  }

  public GetMinutes(): string[] {
      var mins: string[] = [];
      for (let i of this.ListOfInts(0, 59)) {
          mins.push((`0${i.toString()}`).substr(i.toString().length - 1));
      }
      return mins;
  }

  public GetMonths(): kv[]{
    return [
      {k:1, v:'January'},
      {k:2, v:'February'},
      {k:3, v:'March'},
      {k:4, v:'April'},
      {k:5, v:'May'},
      {k:6, v:'June'},
      {k:7, v:'July'},
      {k:8, v:'August'},
      {k:9, v:'September'},
      {k:10, v:'October'},
      {k:11, v:'November'},
      {k:12, v:'December'}
    ];
  }

  public GetDayParts(): string[] {
      return ['AM', 'PM'];
  }

  public defaultHourEditModel: StaffHourEditModel = {
          RecordNo: -1,
          GuardianID: 0,
          DateYear: 2017,
          DateMonth: 1,
          DateDay: 1,
          TimeInHour: 7,
          TimeInMinute: 0,
          TimeInDayPart: 'AM',
          TimeOutHour: 7,
          TimeOutMinute: 0,
          TimeOutDayPart: 'AM',
          LocationID: 11,
          Comment: '',
          ModifiedBy: 1598,
          ModifiedWhen: new Date(2017,1,1),
          Paid:'',
          PayPeriodID: 0
      };

  public getMinuteOfDay(hour: number, minute: number, dayPart: string): number {
      hour = (hour % 12) + 12 * (Number((dayPart === 'PM')));
      return hour * 60 + minute;

  }
  public getMinuteOfDayFromString(timeString: string): number {
      let timeArray = timeString.replace(' ', ':').split(':');
      return this.getMinuteOfDay(parseInt(timeArray[0]), parseInt(timeArray[1]), timeArray[2]);

  }



  public validateDateWorked(staffHour: StaffHourEditModel, timeWorked: number): string {
      if (staffHour.LocationID == 0) return "You must choose a location.";
      let today: Date = new Date();
      let recordDate: Date = new Date(staffHour.DateYear, staffHour.DateMonth - 1, staffHour.DateDay);

      if (today < recordDate) return ' You may not enter hours for a date in the future. ';
      if (this.minEditDate() > recordDate) return `You may enter hours for dates on or before ${this.minEditDate().toDateString()} at the central office.`;
      if (timeWorked < 0.00) return 'Time Out may not be before Time In';
    console.log(this.getMinuteOfDay(staffHour.TimeOutHour, staffHour.TimeOutMinute, staffHour.TimeOutDayPart));
      console.log('>=');
      console.log(this.getMinuteOfDay(staffHour.TimeInHour, staffHour.TimeInMinute, staffHour.TimeInDayPart));
      return 'OK';
  }

  public minEditDate(): Date {
      let retval = new Date();
      switch (retval.getDay()) {
          case 0:
              retval.setDate(retval.getDate() - 6);
              break;
          case 1:
              retval.setDate(retval.getDate() - 7);
              break;
          default:
              retval.setDate(retval.getDate() - (retval.getDay() + 2));
              break;
      }
      return retval;
  }

  public sleep(time: Number) {
      return new Promise((resolve) => setTimeout(resolve, time));
  }

  public getStaffListHour(hour: StaffHourFacadeModel): StaffHourListModel{
   return <StaffHourListModel>{
      Hour: hour,
      IsDisabled: ((new Date(hour.DateWorked) < this.minEditDate()) || hour.IsPaid)
    }
  }

  public getDateIsPriorToMinEditDate(year: number, month: number, day: number): boolean{

    return new Date(year,month,day) < this.minEditDate();
  }

  getStaffHeaderModels(guardianId: number, permissionId: number) {
    this.datasvc.getStaffHeaderModels(guardianId, permissionId).subscribe(result => {
      //this.viewmodel.staffHeaderModels = result;
      this.staffHeaderModels = result.sort((n1, n2) => {
          if (n1.GuardianName > n2.GuardianName) { return 1; }
          if (n1.GuardianName < n2.GuardianName) { return -1; }
          return 0;
        }
      );

    });
  }
}
