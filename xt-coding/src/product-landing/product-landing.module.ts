import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductLandingComponent } from './product-landing.component';
import { ProductLandingService } from './product-landing.service';
import { ProductLandingRoutingModule } from './product-landing.routing.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        ProductLandingRoutingModule
    ],
    declarations: [ProductLandingComponent],
    providers: [ProductLandingService]
})

export class ProductLandingModule { }