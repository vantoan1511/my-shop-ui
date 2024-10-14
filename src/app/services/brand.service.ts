import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PageRequest} from "../types/page-request.type";
import {Sort} from "../types/sort.type";
import {Response} from "../types/response.type";
import {Brand, Product} from "../types/product.type";

@Injectable({
    providedIn: 'root'
})
export class BrandService {
    protected BASE_URL = environment.PRODUCT_SERVICE_API;
    protected BRAND_SERVICE_API_URL = `${this.BASE_URL}/brands`

    constructor(private http: HttpClient) {
    }

    getBy(pageRequest?: PageRequest, sort?: Sort) {
        return this.http.get<Response<Brand>>(this.BRAND_SERVICE_API_URL, {
            params: {
                ...pageRequest,
                ...sort,
            },
        });
    }

    getBySlug(slug: string) {
        return this.http.get<Brand>(`${this.BRAND_SERVICE_API_URL}/${slug}`);
    }

    create(brandCreation: Brand) {
        return this.http.post<Product>(this.BRAND_SERVICE_API_URL, brandCreation);
    }

    update(brandUpdate: Brand) {
        return this.http.put(`${this.BRAND_SERVICE_API_URL}/${brandUpdate.id}`, brandUpdate);
    }

    delete(ids: number[]) {
        return this.http.delete(this.BRAND_SERVICE_API_URL, {
            body: ids
        });
    }
}
