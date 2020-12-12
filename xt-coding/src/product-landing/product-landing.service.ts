import { Injectable } from  '@angular/core';
import { HttpClient } from '@angular/common/http'
import { isNull } from 'lodash';

@Injectable()
export class ProductLandingService {
    constructor (private http: HttpClient) {

    }

    getAllProducts() {
        const url = "https://api.spacexdata.com/v3/launches?limit=100";
        return this.http.get(url);
    }

    getFilteredResult(selectedFilters: any) {
        let url = 'https://api.spacexdata.com/v3/launches?limit=100'
        Object.keys(selectedFilters).forEach((filter) => {
            if(!isNull(selectedFilters[filter])) {
                url += '&'+filter+'='+selectedFilters[filter];
            }
        });
        console.log(url);
        return this.http.get(url);
    }
}
