import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {
  LoginParam,
  StaffHeaderModel,
  StaffHourFacadeModel,
  StaffHourEditModel,
  LocationModel,
  validationHour,
  kv, StaffHeaderView
} from './my-models';

@Injectable()
export class WebApiService {
private baseUrl = 'http://staffhourswebapi2.azurewebsites.net/api/StaffHours';
//private baseUrl = 'http://localhost:59312/api/StaffHours';



    constructor(private http: Http) { }

    getStaffHeaderView(loginParam: LoginParam): Observable<StaffHeaderView>{
      let url = `${this.baseUrl}/GetStaffHeaderView/${loginParam.Login}/${loginParam.Pwd}`;
      //console.log(url);
      return this.http.get(url, this.getGetOptions()).map(response=>response.json()).catch(this.handleError);

    }


    getStaffHeaderModels(guardianId: number, permissionId: number): Observable<StaffHeaderModel[]>{
        let url = `${this.baseUrl}/GetStaffHeaderModels/${guardianId}/${permissionId}`;
        return this.http.get(url, this.getGetOptions()).map(response=>response.json()).catch(this.handleError);
    }

    getStaffHourFacadeModels (guardianID:number, dateFrom: string, dateTo: string): Observable<StaffHourFacadeModel[]> {
        let url = `${this.baseUrl}/GetStaffHourFacadeModels/${guardianID}/${dateFrom}/${dateTo}`;
        return this.http.get(url, this.getGetOptions()).map(response=>response.json())
          .catch(this.handleError);
    }



    getStaffHourEditModel(guardianID: number, recordNo: number): Observable<StaffHourEditModel>{
      let url = `${this.baseUrl}/GetStaffHourEditModel/${guardianID}/${recordNo}`;
      return this.http.get(url, this.getGetOptions()).map(response=>response.json())
        .catch(this.handleError);
    }

    getLocations(): Observable<LocationModel[]>{
      let url = `${this.baseUrl}/GetLocations`;
      return this.http.get(url, this.getGetOptions()).map(response=>response.json()).catch(this.handleError);
    }

    putStaffHour(hour: StaffHourEditModel): Observable<number>{
      let url = `${this.baseUrl}/UpsertStaffHourEditModel`;
      return this.http.put(url, JSON.stringify(hour), this.getPutOptions())
        .map(this.extractData)
        .catch(this.handleError);
    }

    checkRecordConflict(hour: StaffHourEditModel): Observable<number> {
        let url = `${this.baseUrl}/CheckRecordConflict`;
        return this.http.put(url, JSON.stringify(hour), this.getPutOptions())
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server  error'));
    }

    deleteStaffHour(recordNo: number): Observable<number>{
        let url = `${this.baseUrl}/DeleteStaffHour/${recordNo}`;
        return this.http.delete(url)
            .map((res: Response) => res.json())
            .catch((error:any)=>Observable.throw(error.json().error || 'Server  error'));
    }

     private getHeaders(){
         let headers = new Headers();
         headers.append('Accept', 'application/json');
         return headers;
     }

    private getGetOptions(){
      let headers = new Headers({'Accept': 'application/json'});
      return new RequestOptions({headers: headers});
    }



    private getPutOptions(){
      let headers = new Headers({'Content-Type': 'application/json'});
      return new RequestOptions({headers: headers});
    }


    private extractData(res: Response){
        let body = res.json();
        return body.data || {};
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
