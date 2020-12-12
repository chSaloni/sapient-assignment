import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductLandingComponent } from '../product-landing/product-landing.component'


const routes: Routes = [
  {
    path: 'products/:launch_year/:launch_success/:land_success',
    canLoad: [],
    component: ProductLandingComponent
  },
  {
    path: 'products',
    component: ProductLandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class ProductLandingRoutingModule { 

}
