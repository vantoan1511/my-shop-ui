import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PageRequest} from "../types/page-request.type";
import {Sort} from "../types/sort.type";
import {Response} from "../types/response.type";
import {Category, Model} from "../types/product.type";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    protected BASE_URL = environment.PRODUCT_SERVICE_API;
    protected CATEGORY_SERVICE_API_URL = `${this.BASE_URL}/categories`

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.getBy({
            page: 1, size: 999
        })
    }

    getBy(pageRequest?: PageRequest, sort?: Sort) {
        return this.http.get<Response<Category>>(this.CATEGORY_SERVICE_API_URL, {
            params: {
                ...pageRequest,
                ...sort,
            },
        });
    }

    getBySlug(slug: string) {
        return this.http.get<Category>(`${this.CATEGORY_SERVICE_API_URL}/${slug}`);
    }

    create(categoryCreation: Category) {
        return this.http.post<Category>(this.CATEGORY_SERVICE_API_URL, categoryCreation);
    }

    update(categoryUpdate: Category) {
        return this.http.put(`${this.CATEGORY_SERVICE_API_URL}/${categoryUpdate.id}`, categoryUpdate);
    }

    delete(ids: number[]) {
        return this.http.delete(this.CATEGORY_SERVICE_API_URL, {
            body: ids
        });
    }
}
