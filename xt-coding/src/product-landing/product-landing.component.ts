import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductLandingService } from './product-landing.service';
import { isNull } from 'lodash';
import { Router } from '@angular/Router';

export interface IProductStatus {
  name : string;
  id: number;
  launchYear: number;
  launchSuccess: boolean;
  landSuccess: boolean;
  imageLink: string;
}

@Component({
  selector: 'app-product-landing',
  templateUrl: './product-landing.component.html',
  styleUrls: ['./product-landing.component.css']
})

export class ProductLandingComponent implements OnInit {
  productListStatus: IProductStatus[] = [];
  launchYearFilterOptions: Array<number> = [];
  selectedFilters = {
    launch_year: null,
    launch_success: null,
    land_success: null
  };
  loading: boolean = true;
  constructor(private productService: ProductLandingService, private _route: Router) { }

  ngOnInit() {
    this.getlaunchYearFilters();
    this.productService.getAllProducts().pipe().subscribe((response: any) => {
      this.loading = false;
      this.productListStatus = this.processProductresponse(response);
    });
  }

  getlaunchYearFilters() {
    const currentYear = new Date().getFullYear();
    for (let year = 2006; year <= currentYear; year++) {
      this.launchYearFilterOptions.push(year);
    }
  }

  processProductresponse(productRes: any[]) : IProductStatus[]{
    let productStatsus = [] as IProductStatus[];
    productRes.forEach((res) => {
      const productStatusObj = {
        name: res.mission_name,
        id: res.flight_number,
        launchYear: res.launch_year,
        launchSuccess: res.launch_success ? true : false,
        landSuccess: res.rocket.first_stage.cores[0].land_success ? true : false,
        imageLink: res.links.mission_patch
      } as IProductStatus;
      productStatsus.push(productStatusObj);
    });
    return productStatsus;
  }

  applyFilter(data, filterType) {
    this.productListStatus = [];
    this.loading = true;
    if (isNull(this.selectedFilters[filterType])) {
      this.selectedFilters[filterType] = data;
    } else {
      if(this.selectedFilters[filterType] !== data) {
        this.selectedFilters[filterType] = data;
      } else {
        this.selectedFilters[filterType] = null;
      }
    }
    if(Object.values(this.selectedFilters).every((filter) => isNull(filter))) {
      this._route.navigate(['/products']);
    } else {
       this._route.navigate(['/products'], { queryParams: {
        launch_year:  !isNull(this.selectedFilters.launch_year) ? this.selectedFilters.launch_year : 'All',
        launch_success: !isNull(this.selectedFilters.launch_success) ? this.selectedFilters.launch_success : 'All',
        land_success: !isNull(this.selectedFilters.land_success) ? this.selectedFilters.land_success : 'All'
       }});
    }
    this.productService.getFilteredResult(this.selectedFilters).pipe().subscribe((response: any) => {
      this.loading = false;
      this.productListStatus = this.processProductresponse(response);
    });
  }

}
