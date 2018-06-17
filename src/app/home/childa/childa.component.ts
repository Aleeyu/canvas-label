import { Component, OnInit } from '@angular/core';
import { ObService } from '../../services/ob.service';

@Component({
  selector: 'app-childa',
  templateUrl: './childa.component.html',
  styleUrls: ['./childa.component.css']
})
export class ChildaComponent implements OnInit {
  status:boolean = false
  subscription:any;
  constructor(private ObService:ObService) { }

  ngOnInit() {
    this.subscription=this.ObService.status.subscribe(status=>this.status=status)
  }

}
