import { Injectable } from  '@angular/core';
import { HttpClient } from '@angular/common/http'
import { isNull } from 'lodash';

@Injectable()
export class ProductLandingService {
    constructor (private http: HttpClient) {

    }

    getAllProducts() {
        let url = "https://api.spacexdata.com/v4/launches"; 
        return this.http.get(url);
    }

    getSelectedProducts(selectedFilters: any) {
        let body;
        let url = "https://api.spacexdata.com/v4/launches/query";
        let query = {};
        Object.keys(selectedFilters).forEach((filter) => {
            if(!isNull(selectedFilters[filter])) {
                if (filter === 'launchYear') {
                    query['date_utc'] = {
                        "$gte": `${selectedFilters[filter].toString()}-01-01T00:00:00.000Z`, 
                        "$lte": `${selectedFilters[filter].toString()}-12-31T00:00:00.000Z` 
                    }
                } 

                if (filter === 'launchSuccess') {
                    query['success'] = selectedFilters[filter];
                }

                if (filter === 'landingSuccess') {
                    query['cores.landing_success'] = selectedFilters[filter];
                }
            }
            body = {
                query,
                "options": {
                     "limit": 100 
                } 
            }
        });
        console.log(body);
        
        return this.http.post(url,body);
    }
}
