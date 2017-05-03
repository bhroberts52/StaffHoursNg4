import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent }   from './login.component';
import { HoursListComponent } from './hours-list.component';
import { HourEditComponent } from './hour-edit.component';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'hours-list', component: HoursListComponent},
    { path: 'login', component: LoginComponent},
    { path: 'hour-edit/:id', component: HourEditComponent}

]

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }