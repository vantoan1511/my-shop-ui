import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "./product";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(protected readonly http: HttpClient) {
    }

    public fetchAll() {
        return this.http
            .get<Product[]>('assets/json/products.json')
            .pipe(map((products) => products.map((product) => new Product(product))));
    }
}
