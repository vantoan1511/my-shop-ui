import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PageRequest} from "../types/page-request.type";
import {Sort} from "../types/sort.type";
import {PagedResponse} from "../types/response.type";
import {Product, ProductStat, SearchCriteria} from "../types/product.type";
import {ProductImage} from "../types/image.type";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  protected BASE_URL = environment.PRODUCT_SERVICE_API;
  protected PRODUCTS_URL = `${this.BASE_URL}/products`

  constructor(private http: HttpClient) {
  }

  getStats() {
    return this.http.get<ProductStat>(`${this.PRODUCTS_URL}/statistic`);
  }

  searchProducts(pageRequest?: PageRequest, sort?: Sort, searchCriteria?: SearchCriteria) {
    const filteredCriteria = Object.entries(searchCriteria || {})
      .filter(([_, value]) => value !== undefined && value !== '') // Remove undefined and empty strings
      .reduce((acc, [key, value]) => ({...acc, [key]: value}), {});

    const params = {
      ...pageRequest,
      ...sort,
      ...filteredCriteria,
    };

    return this.http.get<PagedResponse<Product>>(this.PRODUCTS_URL, {params});
  }


  getProducts(pageRequest?: PageRequest, sort?: Sort) {
    return this.searchProducts(pageRequest, sort);
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
