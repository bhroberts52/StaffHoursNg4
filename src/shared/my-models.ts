export interface StaffHeaderView{
  GuardianID: number;
  GuardianName: string;
  Login: string;
  Pwd: string;
  PermissionID: number;
  PTOEnabled?: boolean;
  PTOBalance?: number;
}

export interface StaffHeaderModel {
    GuardianID: number;
    GuardianName: string;
}

export interface LoginParam {
    Login: string;
    Pwd: string;
    HasFailed: boolean;
}

export interface StaffHourFacadeModel{
    RecordNo: number;
    GuardianID: number;
    GuardianName: string;
    DateWorked: Date;
    LocationName: string;
    TimeIn: string;
    TimeOut: string;
    IsPaid: boolean;
    Comment: string;
    MinuteIn: number;

    Paid: string;
    PayPeriodID: number;
    TimeWorked?: number;
    MinuteOut: number;
    ModifiedWhen: Date;
    ModifiedByName: string;

}

export interface StaffHourListModel{
  Hour: StaffHourFacadeModel;
  IsDisabled: boolean;  
}

export interface StaffHourEditModel{
  RecordNo: number;
  GuardianID: number;
  DateYear: number;
  DateMonth: number;
  DateDay: number;
  TimeInHour: number;
  TimeInMinute: number;
  TimeInDayPart: string;
  TimeOutHour: number;
  TimeOutMinute: number;
  TimeOutDayPart: string;
  LocationID: number;
  Comment: string;
  ModifiedBy: number;
  ModifiedWhen: Date;
  Paid: string;
  PayPeriodID: number;
}

export interface kv {
  k: number;
  v: string;
}

export interface LocationModel{
  LocationID: number;
  LocationName: string;
}

export interface validationHour {
    RecordNo: number;
    MinuteIn: number;
    MinuteOut: number;
}
