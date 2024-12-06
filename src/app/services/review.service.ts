import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CreateReviewRequest, Review, ReviewRequestFilter, ReviewStatistic} from "../types/review.type";
import {PagedResponse} from "../types/response.type";
import {PageRequest} from "../types/page-request.type";
import {Sort} from "../types/sort.type";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  protected BASE_URL = environment.REVIEW_SERVICE_API;

  constructor(private http: HttpClient) {
  }

  public getByCriteria(filter?: ReviewRequestFilter, pageRequest?: PageRequest, sort?: Sort) {
    return this.http.get<PagedResponse<Review>>(`${this.BASE_URL}/reviews`, {
      params: {
        ...filter,
        ...pageRequest,
        ...sort,
      }
    })
  }

  public getReviewStatistic(productSlug: string) {
    return this.http.get<ReviewStatistic>(`${this.BASE_URL}/reviews/statistic`, {
      params: {productSlug},
    })
  }

  public createReview(review: CreateReviewRequest) {
    return this.http.post<Review>(`${this.BASE_URL}/reviews`, review)
  }

  public check(productSlug: string) {
    return this.http.get(`${this.BASE_URL}/reviews/check`, {
      params: {
        productSlug: productSlug
      }
    })
  }
}
