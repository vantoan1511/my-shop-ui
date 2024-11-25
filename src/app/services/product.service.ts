import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PageRequest} from "../types/page-request.type";
import {Sort} from "../types/sort.type";
import {PagedResponse} from "../types/response.type";
import {Product} from "../types/product.type";
import {ProductImage} from "../types/image.type";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  protected BASE_URL = environment.PRODUCT_SERVICE_API;
  protected PRODUCTS_URL = `${this.BASE_URL}/products`
  protected BRANDS_URL = `${this.BASE_URL}/brands`

  constructor(private http: HttpClient) {
  }

  getProductByCriteria(pageRequest?: PageRequest, sort?: Sort) {
    return this.http.get<PagedResponse<Product>>(this.PRODUCTS_URL, {
      params: {
        ...pageRequest,
        ...sort,
      },
    });
  }

  getBySlug(slug: string) {
    return this.http.get<Product>(`${this.PRODUCTS_URL}/${slug}`);
  }

  getImagesById(productId: number) {
    return this.http.get<ProductImage[]>(`${this.PRODUCTS_URL}/${productId}/images`);
  }

  create(productCreation: Product) {
    return this.http.post<Product>(this.PRODUCTS_URL, productCreation);
  }

  update(productUpdate: Product) {
    return this.http.put(`${this.PRODUCTS_URL}/${productUpdate.id}`, productUpdate);
  }

  updateImages(productId: number, imageIds: number[]) {
    return this.http.put(`${this.PRODUCTS_URL}/${productId}/images`, imageIds);
  }

  setFeaturedImage(productId: number, imageId: number) {
    return this.http.patch(`${this.PRODUCTS_URL}/${productId}/images/${imageId}`, {});
  }

  delete(ids: number[]) {
    return this.http.delete(this.PRODUCTS_URL, {
      body: ids
    });
  }

  removeImage(productId: number, imageIds: number[]) {
    return this.http.delete(`${this.PRODUCTS_URL}/${productId}/images`, {
      body: imageIds
    });
  }
}
