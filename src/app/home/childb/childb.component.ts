import { Component, OnInit } from '@angular/core';
import { ObService } from '../../services/ob.service';
@Component({
  selector: 'app-childb',
  templateUrl: './childb.component.html',
  styleUrls: ['./childb.component.css']
})
export class ChildbComponent implements OnInit {
  public bol:boolean=false
  constructor(private ObService:ObService) { }

  ngOnInit() {
  }
  change(){
    this.bol = !this.bol;
    this.ObService.changeStatus(this.bol)
  }
}
