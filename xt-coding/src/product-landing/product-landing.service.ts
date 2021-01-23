import { Injectable } from  '@angular/core';
import { HttpClient } from '@angular/common/http'
import { isNull } from 'lodash';

@Injectable()
export class ProductLandingService {
    constructor (private http: HttpClient) {

    }

    getAllProducts(selectedFilters?: any) {
        let url = "https://api.spacexdata.com/v3/launches?limit=100";
        if(selectedFilters) {
            Object.keys(selectedFilters).forEach((filter) => {
                if(!isNull(selectedFilters[filter])) {
                    url += '&'+filter+'='+selectedFilters[filter];
                }
            });
        }
        return this.http.get(url);
    }
}
