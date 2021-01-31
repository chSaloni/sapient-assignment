import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductLandingComponent } from '../product-landing/product-landing.component'


const routes: Routes = [
  {
    path: '',
    redirectTo: '/spaceXLaunch',
    pathMatch: 'full',
    canLoad: []
  },
  {
    path: 'spaceXLaunch',
    component: ProductLandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 

}
