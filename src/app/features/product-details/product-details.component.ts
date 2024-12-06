import {Component, OnInit} from '@angular/core';
import {ProductListComponent} from '../product-list/product-list.component';
import {ProductService} from "../../services/product.service";
import {Favourite, Product} from "../../types/product.type";
import {CurrencyPipe, DatePipe, NgClass, NgOptimizedImage, SlicePipe} from "@angular/common";
import {constant} from "../../shared/constant";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ReviewService} from "../../services/review.service";
import {PageRequest} from "../../types/page-request.type";
import {Sort, SortField} from "../../types/sort.type";
import {Review, ReviewRequestFilter, ReviewStatistic} from "../../types/review.type";
import {PagedResponse} from "../../types/response.type";
import {CartService} from "../../services/cart.service";
import {AlertService} from "../../services/alert.service";
import {AuthenticationService} from "../../services/authentication.service";
import {RecommendedProductsListComponent} from "../recommended-products-list/recommended-products-list.component";
import {ImageUtils} from "../../shared/services/Image.utils";
import {tap} from "rxjs";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [ProductListComponent, CurrencyPipe, NgOptimizedImage, TranslateModule, FormsModule, SlicePipe, DatePipe, RouterLink, RecommendedProductsListComponent, NgClass, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  quantity = 1;
  productSlug: string | null = null;
  product: Product | null = null;
  reviewResponse: PagedResponse<Review> | null = null;
  reviews: Review[] = [];
  reviewStatistic: ReviewStatistic | null = null;
  heroUrl = constant.defaultHeroImageUrl;
  showFullDescription = false;

  filter?: ReviewRequestFilter;
  pageRequest: PageRequest = {page: 1, size: 10};
  sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};

  pagedFavourites: PagedResponse<Favourite> | null = null;
  favourites: Favourite[] = [];

  loading = false;

  isReviewDialogOpened = false;
  rating = 5;
  reviewForm = this.fb.group({
    rating: [this.rating, Validators.required],
    text: ['', Validators.required]
  })

  productNotFound = false;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private cartService: CartService,
    private alertService: AlertService,
    protected authService: AuthenticationService,
    protected imageUtil: ImageUtils
  ) {
    this.translateService.setDefaultLang("vi");
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productSlug = params['slug'];
      if (this.productSlug) {
        this.loadProductDetails(this.productSlug);
        this.filter = {productSlug: this.productSlug};
        this.fetchReviews();
        this.fetchReviewStatistic();
        this.getFavourites();
      }
    });
  }

  onStarClick(selectedRating: number): void {
    this.rating = selectedRating;
    this.reviewForm.patchValue({
      rating: this.rating
    });
  }

  onReviewFormSubmit() {
    console.log(this.reviewForm.value)
    if (this.reviewForm.valid && this.productSlug) {
      const {rating, text} = this.reviewForm.value as Review;
      const title = text;
      const productSlug = this.productSlug;
      this.reviewService.createReview({rating, text, title, productSlug}).subscribe({
        next: () => {
          this.alertService.showSuccessToast("Đã đăng tải nhận xét");
          this.reviews = [];
          this.fetchReviews()
          this.fetchReviewStatistic();
        },
        error: () => this.alertService.showErrorToast("Lỗi")
      })
    }
  }

  isInFavourite(productSlug: string | null) {
    if (!productSlug) {
      return false;
    }

    return this.favourites.some(f => f.productSlug === productSlug);
  }

  getFavourites() {
    this.productService.getFavourites().subscribe((resp) => {
      this.pagedFavourites = resp;
      this.favourites = resp.items;
    })
  }

  addFavourite(productSlug: string | null) {
    if (!productSlug) {
      return;
    }
    if (!this.authService.isAuthenticated) {
      this.alertService.showErrorToast("Cần đăng nhập trước")
      return;
    }
    this.productService.addFavourite(productSlug)
      .pipe(tap(() => this.getFavourites()))
      .subscribe({
        next: () => this.alertService.showSuccessToast("Đã thêm sản phẩm vào mục ưa thích"),
        error: () => this.alertService.showErrorToast("Lỗi")
      })
  }

  private loadProductDetails(slug: string): void {
    this.productService.getBySlug(slug).subscribe({
      next: product => {
        this.product = product;
        this.heroUrl = this.imageUtil.createImageUrl(product.featuredImageId)
      },
      error: () => this.productNotFound = true
    });
  }

  onHoverThumbnail(imageId: number) {
    this.heroUrl = this.imageUtil.createImageUrl(imageId)
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product?.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  validateQuantity(): void {
    if (isNaN(this.quantity)) {
      this.quantity = 0;
      return;
    }

    this.quantity = Math.ceil(this.quantity);
    if (this.quantity < 0) {
      this.quantity = 0;
      return
    }

    if (this.product && this.quantity > this.product?.stockQuantity) {
      this.quantity = this.product.stockQuantity;
    }
  }

  addToCart(quantity: number, productSlug: string | null): void {
    if (!this.authService.isAuthenticated) {
      this.alertService.showErrorToast("You must login first");
      return
    }

    if (!this.validQuantity(quantity)) {
      this.alertService.showErrorToast("Quantity must be greater than 0");
      return;
    }

    if (productSlug) {
      const request = {productSlug, quantity};
      this.cartService.addToCart(request).subscribe({
        next: (cart) => this.alertService.showSuccessToast(`Added to cart`),
        error: () => this.alertService.showErrorToast(`Error while adding to cart`)
      })
    }
  }

  onClickBuyNow() {
    if (!this.authService.isAuthenticated) {
      this.alertService.showErrorToast("You must login first");
      return
    }

    if (!this.validQuantity(this.quantity)) {
      this.alertService.showErrorToast("Quantity must be greater than 0");
      return;
    }

    if (this.productSlug) {
      const request = {productSlug: this.productSlug, quantity: this.quantity};
      this.cartService.addToCart(request).subscribe({
        next: (cart) => {
          this.router.navigate(['/cart'])
        },
        error: () => this.alertService.showErrorToast(`Error while adding to cart`)
      })
    }
  }

  validQuantity(quantity: number) {
    return quantity > 0;
  }

  get discount(): number {
    if (this.product) {
      return Math.round((1 - (this.product?.salePrice / this.product?.basePrice)) * 100)
    }
    return 0;
  }

  protected toggleShowFullDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  protected onRating(rating?: number) {
    if (this.filter) {
      this.filter.rating = rating;
      this.reviews = []
      this.fetchReviews();
    }
  }

  protected onAscending(ascending: boolean) {
    this.sort.ascending = ascending;
    this.reviews = []
    this.fetchReviews();
  }

  private fetchReviews(): void {
    if (!this.filter?.productSlug) return;

    const cleanedFilter = this.cleanFilter(this.filter);

    this.loading = true;
    this.reviewService
      .getByCriteria(cleanedFilter, this.pageRequest, this.sort)
      .subscribe({
        next: reviews => {
          this.reviewResponse = reviews;
          this.reviews = [...this.reviews, ...reviews.items];
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  private fetchReviewStatistic() {
    if (!this.productSlug) return;

    this.loading = true
    this.reviewService.getReviewStatistic(this.productSlug)
      .subscribe({
        next: statistics => {
          this.reviewStatistic = statistics
          this.loading = false;
        },
        error: () => this.loading = false
      },)
  }

  private cleanFilter(filter: ReviewRequestFilter): ReviewRequestFilter {
    return Object.fromEntries(
      Object.entries(filter).filter(([_, value]) => value !== undefined)
    ) as ReviewRequestFilter;
  }

  protected loadMoreReviews() {
    if (this.reviewResponse?.hasNext) {
      this.pageRequest.page++;
      this.fetchReviews();
    }
  }

  protected readonly constant = constant;
  protected readonly Array = Array;
}
