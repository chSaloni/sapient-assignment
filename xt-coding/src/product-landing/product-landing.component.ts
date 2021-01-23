import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductLandingService } from './product-landing.service';
import { isNull, isEmpty } from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';

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
  constructor(private productService: ProductLandingService, private _route: Router, private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getlaunchYearFilters();
    this._activatedRoute.queryParamMap.subscribe((param) => {
      if (isEmpty(param['params'])) {
       this.getAllProducts();
      } else {
        this.getSelectedproducts(param);
      }
    });
  }

  /**
   * To fetch all products without any filter
   */
  getAllProducts() {
    this.productService.getAllProducts().pipe().subscribe((response: any) => {
      this.loading = false;
      this.productListStatus = this.processProductresponse(response);
    }, error => this.loading = false);
  }

 /**
  * 
  * @param param 
  * To fetch selected products based on applied filter on UI
  * Also sets the query params in the api url in service
  */
  getSelectedproducts(param: any) {
    this.selectedFilters.launch_year = param.get('launch_year') === 'All' ? null : Number(param.get('launch_year'));
        this.selectedFilters.launch_success = param.get('launch_success') === 'All' ? null : (param.get('launch_success') === "true" ? true : false);
        this.selectedFilters.land_success = param.get('land_success') === 'All' ? null : (param.get('land_success') === "true" ? true : false);
        this.productService.getAllProducts(this.selectedFilters).pipe().subscribe((response: any) => {
          this.loading = false;
          this.productListStatus = this.processProductresponse(response);
     });
  }

  /**
   * Filter values for Launch year, starting from year 2006 till current year
   */
  getlaunchYearFilters() {
    const currentYear = new Date().getFullYear();
    for (let year = 2006; year <= currentYear; year++) {
      this.launchYearFilterOptions.push(year);
    }
  }

  /**
   * 
   * @param productRes 
   * Transforms the API response to the desired Interface to be used on UI
   */
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

  /**
   * 
   * @param data 
   * @param filterType 
   * Applies selected filter
   * Updated selected filter object
   * Logic for toggle behaviour of filter
   * Updates the url when filter is applied ̰
   */
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
  }

}
