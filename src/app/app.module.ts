import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { HoursListComponent } from './hours-list.component';
import { HourEditComponent } from './hour-edit.component'

import { WebApiService } from '../shared/web-api.service';
import { ViewModelService } from '../shared/view-model.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HoursListComponent,
    HourEditComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule
  ],
  providers: [WebApiService, ViewModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
