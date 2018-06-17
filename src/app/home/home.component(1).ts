import { Component, OnInit } from '@angular/core';
import { ObService } from '../services/ob.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  status:boolean = false
  subscription:any;
  constructor(private ObService:ObService) { }

  ngOnInit() {
    this.subscription=this.ObService.status.subscribe(status=>this.status=status)
  }

}
