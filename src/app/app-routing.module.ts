import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {environment} from "../environments/environment";
import { LbaleComponent } from "./label/label.component";
const routes: Routes = [
  {
    path:'',
    component:LbaleComponent
  },
  {
    path:'home',
    loadChildren:'app/home/home.module#HomeModule'
  },
  {
    path:'product',
    loadChildren:'app/product/product.module#ProductModule'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }