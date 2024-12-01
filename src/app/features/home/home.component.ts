import {Component, OnInit} from '@angular/core';
import {ProductListComponent} from "../product-list/product-list.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgTemplateOutlet} from "@angular/common";
import {BannerComponent} from "../../components/banner/banner.component";
import {PagedResponse} from "../../types/response.type";
import {Product} from "../../types/product.type";
import {PageRequest} from "../../types/page-request.type";
import {Sort, SortField} from "../../types/sort.type";
import {ProductService} from "../../services/product.service";
import {NavigationEnd, Router} from "@angular/router";
import {constant} from "../../shared/constant";
import {environment} from "../../../environments/environment";
import {ProductCardComponent} from "../../components/product-card/product-card.component";
import {tap} from "rxjs";
import {SkeletonComponent} from "../../components/skeleton/skeleton.component";
import {CardLoaderComponent} from "../../shared/components/card-loader/card-loader.component";
import {RecommendedProductsListComponent} from "../recommended-products-list/recommended-products-list.component";
import {ImageUtils} from "../../shared/services/Image.utils";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductListComponent,
    TranslateModule,
    NgTemplateOutlet,
    BannerComponent,
    ProductCardComponent,
    SkeletonComponent,
    CardLoaderComponent,
    RecommendedProductsListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  productResponse: PagedResponse<Product> | null = null;
  products: Product[] = [];
  latestProducts: Product[] = [];
  mostPopularProducts: Product[] = [];
  heroImages: Map<number, string> = new Map();
  pageRequest: PageRequest = {page: 1, size: 10};
  sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};
  loading = false;
  latestProductsLoading = false;
  mostPopularProductsLoading = false;

  constructor(
    private translate: TranslateService,
    private productService: ProductService,
    private router: Router,
    protected imageUtil: ImageUtils
  ) {
    this.translate.setDefaultLang('vi');
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchLatestProducts();
    this.fetchMostPopularProducts();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  private fetchLatestProducts(): void {
    this.latestProductsLoading = true;
    this.productService.searchProducts(this.pageRequest, {
      sortBy: SortField.CREATED_AT,
      ascending: false
    }).pipe(tap(() => this.latestProductsLoading = false))
      .subscribe({
        next: (products) => this.latestProducts = products.items
      })
  }

  private fetchMostPopularProducts(): void {
    this.latestProductsLoading = true;
    this.productService.searchProducts(this.pageRequest, {
      sortBy: SortField.VIEW_COUNT,
      ascending: false
    }).pipe(tap(() => this.mostPopularProductsLoading = false))
      .subscribe({
        next: (products) => this.mostPopularProducts = products.items
      })
  }

  private fetchProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.pageRequest, this.sort).subscribe({
      next: response => {
        this.productResponse = response;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  protected readonly Array = Array;
  protected readonly constant = constant;
}
