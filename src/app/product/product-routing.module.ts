import {Routes, RouterModule} from "@angular/router";
import {ProductComponent} from "./product.component";
import {NgModule} from "@angular/core";
import {DetailComponent} from './detail/detail.component'
const routes: Routes=[
  {
    path:'',
    component:ProductComponent
  },
  {
    path:'detail',
    component:DetailComponent
  }
]

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule],
  providers:[]

})
export class ProductRoutingModule{}