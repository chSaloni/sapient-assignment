import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductLandingService } from './product-landing.service';
import { isNull, isEmpty } from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

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
    launchYear: null,
    launchSuccess: null,
    landingSuccess: null
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
    this.selectedFilters.launchYear = param.get('launchYear') === 'All' ? null : Number(param.get('launchYear'));
        this.selectedFilters.launchSuccess = param.get('launchSuccess') === 'All' ? null : (param.get('launchSuccess') === "true" ? true : false);
        this.selectedFilters.landingSuccess = param.get('landingSuccess') === 'All' ? null : (param.get('landSuccess') === "true" ? true : false);
        this.productService.getSelectedProducts(this.selectedFilters).pipe().subscribe((response: any) => {
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
  processProductresponse(productRes: any) : IProductStatus[]{
    let productStatsus = [] as IProductStatus[];
    const items = productRes.docs ?  productRes.docs : productRes;
    items.forEach((res) => {
      const productStatusObj = {
        name: res.name,
        id: res.flight_number,
        launchYear: Number(moment(res.date_utc).format('YYYY').valueOf()),
        launchSuccess: res.success ? true : false,
        landSuccess: res.cores[0].landing_success ? true : false,
        imageLink: res.links.patch.small ? res.links.patch.small : 'assets/No_image_available.svg'
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
      this._route.navigate(['/spaceXLaunch']);
    } else {
       this._route.navigate(['/spaceXLaunch'], { queryParams: {
        launchYear:  !isNull(this.selectedFilters.launchYear) ? this.selectedFilters.launchYear : 'All',
        launchSuccess: !isNull(this.selectedFilters.launchSuccess) ? this.selectedFilters.launchSuccess : 'All',
        landingSuccess: !isNull(this.selectedFilters.landingSuccess) ? this.selectedFilters.landingSuccess : 'All'
       }});
    }
  }

}
