import { Injectable } from '@angular/core';
import {Observable,Observer } from 'rxjs/Rx'
@Injectable()
export class ObService {
  public status:Observable<boolean>
  private observer:Observer<boolean>
  constructor() { 
    this.status = new Observable<boolean>(observer=>this.observer=observer).share()
  }
  changeStatus(newstatus){
    this.observer.next(newstatus)
  }
}
