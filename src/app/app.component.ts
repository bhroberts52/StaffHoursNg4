import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewModelService } from '../shared/view-model.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'EDS Staff Hours';
  constructor(public viewmodel: ViewModelService, private router: Router){}
  onLogout(){
    this.viewmodel.reset();
    this.router.navigate(['/login'])
  }


}
