import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import { LoginParam } from '../shared/my-models';

import { WebApiService } from '../shared/web-api.service';
import { ViewModelService } from '../shared/view-model.service';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent{
    isWaiting: boolean = false;
    loginParam: LoginParam = {Login:'', Pwd:'', HasFailed: false};

    constructor(public viewmodel: ViewModelService,  private datasvc: WebApiService, private router: Router) {
        //this.viewmodel.reset();
    }

     onSubmit(login: string, pwd: string){
        this.getStaffHeaderView(login, pwd);
    }

    getStaffHeaderView(login: string, pwd: string){
      this.isWaiting = true;
      this.loginParam = {Login: login, Pwd: pwd, HasFailed: false};
       this.datasvc.getStaffHeaderView(this.loginParam)
       .subscribe(result=> {
           this.viewmodel.staffHeaderView = result;
           this.loginParam.HasFailed = (this.viewmodel.staffHeaderView.GuardianID===0);
           this.onLogin();
            this.isWaiting = false;
            if (!this.loginParam.HasFailed) {
                this.viewmodel.getStaffHeaderModels(this.viewmodel.staffHeaderView.GuardianID, this.viewmodel.staffHeaderView.PermissionID);
                this.viewmodel.selectedGuardianID = this.viewmodel.staffHeaderView.GuardianID;
                this.goToStaffHoursList();
            }
        });
    }

    onLogin(){
        console.log(this.viewmodel.staffHeaderView);
    }

    goToStaffHoursList(){
      this.router.navigate(['/hours-list'])
    }
}