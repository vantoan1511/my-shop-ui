import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PageRequest} from "../types/page-request.type";
import {Sort} from "../types/sort.type";
import {PagedResponse} from "../types/response.type";
import {Model} from "../types/product.type";

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    protected BASE_URL = environment.PRODUCT_SERVICE_API;
    protected MODEL_SERVICE_API_URL = `${this.BASE_URL}/models`

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.getBy({
            page: 1, size: 999
        })
    }

    getBy(pageRequest?: PageRequest, sort?: Sort) {
        return this.http.get<PagedResponse<Model>>(this.MODEL_SERVICE_API_URL, {
            params: {
                ...pageRequest,
                ...sort,
            },
        });
    }

    getBySlug(slug: string) {
        return this.http.get<Model>(`${this.MODEL_SERVICE_API_URL}/${slug}`);
    }

    create(modelCreation: Model) {
        return this.http.post<Model>(this.MODEL_SERVICE_API_URL, modelCreation);
    }

    update(modelUpdate: Model) {
        return this.http.put(`${this.MODEL_SERVICE_API_URL}/${modelUpdate.id}`, modelUpdate);
    }

    delete(ids: number[]) {
        return this.http.delete(this.MODEL_SERVICE_API_URL, {
            body: ids
        });
    }
}
