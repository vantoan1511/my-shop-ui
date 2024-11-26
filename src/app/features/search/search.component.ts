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
  forkJoin,
  map,
  of,
  switchMap
} from "rxjs";
import {SortField} from "../../types/sort.type";
import {PageRequest} from "../../types/page-request.type";
import {FormsModule} from "@angular/forms";
import {CardLoaderComponent} from "../../shared/components/card-loader/card-loader.component";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {NgxSliderModule, Options} from "@angular-slider/ngx-slider";

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

  featuredImageMap = new Map<number, string>();

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

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
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

  fetchProducts() {
    const pageRequest = {page: this.page, size: this.size} as PageRequest
    // const sort = {sortBy: this.sortBy, ascending: this.ascending} as Sort

    this.productLoading = true

    this.keywordSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      combineLatestWith(
        this.brandSubject.pipe(distinctUntilChanged()),
        this.categorySubject.pipe(distinctUntilChanged()),
        this.priceSubject.pipe(distinctUntilChanged()),
        this.sortSubject
      ),
      switchMap(([keyword, brands, categories, {minPrice, maxPrice}, sort]) =>
        this.productService.searchProducts(pageRequest, sort, {keyword, brands, categories, minPrice, maxPrice}).pipe(
          catchError((error) => {
            console.error('Error fetching products:', error);
            return of({} as PagedResponse<Product>);
          }),
          switchMap((response) => {
            const products = response.items ?? [];

            if (products.length === 0) {
              return of({pagedProduct: response, products: [], imageMap: new Map()});
            }

            const imageRequests = products.map((product) =>
              this.productService.getImagesById(product.id).pipe(
                map((images) => {
                  const featuredImage = images.find((img) => img.featured) || images[0];
                  const imageUrl = this.createImageUrl(featuredImage?.imageId)
                  return {productId: product.id, imageUrl};
                }),
                catchError((error) => {
                  console.error(`Error fetching images for product ${product.id}:`, error);
                  return of({productId: product.id, imageUrl: ''});
                })
              )
            );

            return forkJoin(imageRequests).pipe(
              map((imageData) => {
                const imageMap = new Map<number, string>();
                imageData.forEach(({productId, imageUrl}) => {
                  imageMap.set(productId, imageUrl);
                });

                return {
                  pagedProduct: response,
                  products,
                  imageMap,
                };
              })
            );
          })
        )
      ),
      catchError((error) => {
        console.error('Unexpected error in fetch pipeline:', error);
        this.productLoading = false;
        return of(null);
      })
    ).subscribe({
      next: (result) => {
        if (result) {
          const {pagedProduct, products, imageMap} = result;
          this.pagedProduct = pagedProduct;
          this.products = products;
          this.featuredImageMap = imageMap;
        }
        this.productLoading = false;
      },
      error: () => {
        this.productLoading = false;
      },
    });
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
  }

  buildAndEmitCategorySelectedChange() {
    const categoryQuery = this.selectedCategories.map(category => category.slug).join(',');
    this.categorySubject.next(categoryQuery);
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


  retrieveProductThumbnail(productId: number) {
    return this.featuredImageMap.get(productId) || constant.defaultHeroImageUrl;
  }

  createImageUrl(imageId?: number) {
    if (!imageId) {
      return constant.defaultHeroImageUrl;
    }
    return `${environment.IMAGE_SERVICE_API}/images/${imageId}`;
  }

  protected readonly Array = Array;
  protected readonly constant = constant;
}
