import {Component, OnInit} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {constant} from "../../shared/constant";
import {TranslateModule} from "@ngx-translate/core";
import {ProductCardComponent} from "../../components/product-card/product-card.component";
import {PagedResponse} from "../../types/response.type";
import {Brand, Category, Product} from "../../types/product.type";
import {BrandService} from "../../services/brand.service";
import {CategoryService} from "../../services/category.service";
import {ProductService} from "../../services/product.service";
import {
  BehaviorSubject,
  catchError,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap
} from "rxjs";
import {SortField} from "../../types/sort.type";
import {FormsModule} from "@angular/forms";
import {CardLoaderComponent} from "../../shared/components/card-loader/card-loader.component";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSliderModule, Options} from "@angular-slider/ngx-slider";
import {ReviewService} from "../../services/review.service";
import {ImageUtils} from "../../shared/services/Image.utils";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CurrencyPipe,
    TranslateModule,
    ProductCardComponent,
    FormsModule,
    CardLoaderComponent,
    NgxSliderModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  pagedBrand: PagedResponse<Brand> | null = null;
  pagedCategory: PagedResponse<Category> | null = null;
  pagedProduct: PagedResponse<Product> | null = null;
  brands: Brand[] = []
  categories: Category[] = []
  products: Product[] = []

  page = 1;
  size = 20;
  sortBy = SortField.CREATED_AT;
  ascending = false;
  productLoading = false

  priceRange = {
    minPrice: 0,
    maxPrice: 150_000_000,
  };

  options: Options = {
    floor: 0,
    ceil: 150_000_000,
    step: 500_000,
    showTicks: true,
    pushRange: true,
    noSwitching: true
  };

  keyword = ''
  selectedBrands: { name: string, slug: string }[] = [];
  selectedCategories: { name: string, slug: string }[] = [];
  sort: 'LATEST' | 'LOW_PRICE' | 'HIGH_PRICE' = 'LATEST'
  keywordSubject = new BehaviorSubject<string>('');
  brandSubject = new BehaviorSubject<string | undefined>(undefined);
  categorySubject = new BehaviorSubject<string | undefined>(undefined);
  priceSubject = new BehaviorSubject<{ minPrice: number, maxPrice: number }>(this.priceRange);
  sortSubject = new BehaviorSubject<{ sortBy: SortField, ascending: boolean }>({
    sortBy: this.sortBy,
    ascending: this.ascending
  });
  pageSubject = new BehaviorSubject({page: this.page, size: this.size});

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router,
    protected imageUtil: ImageUtils
  ) {
  }

  ngOnInit(): void {
    this.extractKeywordFromQuery()
    this.fetchBrands()
    this.fetchCategories()
    this.fetchProducts()
  }

  extractKeywordFromQuery() {
    this.route.queryParams.subscribe(params => {
      const keyword = params["keyword"] || '';
      this.keyword = keyword
      this.onKeywordChange(keyword);
    })
  }

  fetchBrands() {
    this.brandService.getBy({page: 1, size: 20}).subscribe((response) => {
      this.pagedBrand = response;
      this.brands = response.items;
    })
  }

  fetchCategories() {
    this.categoryService.getBy({page: 1, size: 20}).subscribe((response) => {
      this.pagedCategory = response;
      this.categories = response.items;
    })
  }

  removeBrandTag(slug: string) {
    this.selectedBrands = this.selectedBrands.filter(tag => tag.slug !== slug);
    this.buildAndEmitBrandSelectedChange()
  }

  removeCategoryTag(slug: string) {
    this.selectedCategories = this.selectedCategories.filter(tag => tag.slug !== slug);
    this.buildAndEmitCategorySelectedChange()
  }

  removeAllTags() {
    this.selectedBrands = []
    this.selectedCategories = []
    this.buildAndEmitBrandSelectedChange()
    this.buildAndEmitCategorySelectedChange()
  }

  addBrandTag(newTag: { name: string, slug: string }): void {
    if (!this.isSelectedBrandTag(newTag)) {
      this.selectedBrands.push(newTag);
      this.buildAndEmitBrandSelectedChange();
    } else {
      this.removeBrandTag(newTag.slug)
    }
  }

  addCategoryTag(newTag: { name: string, slug: string }): void {
    if (!this.isSelectedCategoryTag(newTag)) {
      this.selectedCategories.push(newTag);
      this.buildAndEmitCategorySelectedChange()
    } else {
      this.removeCategoryTag(newTag.slug)
    }
  }

  buildAndEmitBrandSelectedChange() {
    const brandQuery = this.selectedBrands.map(brand => brand.slug).join(',');
    this.brandSubject.next(brandQuery);
    this.refreshFetchedProducts()
  }

  buildAndEmitCategorySelectedChange() {
    const categoryQuery = this.selectedCategories.map(category => category.slug).join(',');
    this.categorySubject.next(categoryQuery);
    this.refreshFetchedProducts()
  }

  isSelectedBrandTag(tag: { name: string, slug: string }) {
    return this.selectedBrands.some(selectedTag => selectedTag.slug === tag.slug)
  }

  isSelectedCategoryTag(tag: { name: string, slug: string }) {
    return this.selectedCategories.some(selectedTag => selectedTag.slug === tag.slug)
  }

  onKeywordChange(keyword: string) {
    this.router.navigate([], {
      queryParams: {keyword},
      queryParamsHandling: 'merge'
    });
    this.keywordSubject.next(keyword);
    this.refreshFetchedProducts()
  }

  onPriceRangeChange() {
    this.priceSubject.next({minPrice: this.priceRange.minPrice, maxPrice: this.priceRange.maxPrice});
  }

  onSortChange() {
    switch (this.sort) {
      case 'LATEST':
        this.sortSubject.next({sortBy: SortField.CREATED_AT, ascending: false});
        break;
      case "HIGH_PRICE":
        this.sortSubject.next({sortBy: SortField.SALE_PRICE, ascending: false});
        break;
      default:
        this.sortSubject.next({sortBy: SortField.SALE_PRICE, ascending: true});
    }
  }

  refreshFetchedProducts() {
    const latest = this.pageSubject.value;
    if (latest.size !== this.size) {
      this.pageSubject.next({page: 1, size: this.size})
    }
  }

  onLoadMoreProducts() {
    const {size} = this.pageSubject.value;
    const nextIndex = size / this.size + 1
    this.pageSubject.next({page: this.page, size: this.size * nextIndex});
  }

  numberOfNextResults() {
    const remaining = (this.pagedProduct?.totalItems || 0) - (this.pagedProduct?.numberOfItems || 0)
    return Math.min(this.size, remaining)
  }

  private fetchProducts() {
    this.keywordSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        combineLatestWith(
          this.brandSubject.pipe(distinctUntilChanged()),
          this.categorySubject.pipe(distinctUntilChanged()),
          this.priceSubject.pipe(distinctUntilChanged()),
          this.sortSubject.pipe(distinctUntilChanged()),
          this.pageSubject.pipe(distinctUntilChanged())
        ), tap(() => this.productLoading = true),
        switchMap(([keyword, brands, categories, {minPrice, maxPrice}, sort, pageRequest]) =>
          this.productService.searchProducts(pageRequest, sort, {
            keyword,
            brands,
            categories,
            minPrice,
            maxPrice,
            active: true
          })
        ),
        catchError((error) => of(null))
      )
      .subscribe({
        next: (result) => {
          this.pagedProduct = result;
          this.products = result?.items ?? []
          this.productLoading = false;
        },
        error: () => this.productLoading = false,
      });
  }

  protected readonly Array = Array;
  protected readonly constant = constant;
}
