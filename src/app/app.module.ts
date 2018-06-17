import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

// 设置为hash模式
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { LableCanvasComponent } from './label-canvas/label-canvas.component';
import { LbaleComponent } from './label/label.component';
@NgModule({
  declarations: [
    AppComponent,
    LableCanvasComponent,
    LbaleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
