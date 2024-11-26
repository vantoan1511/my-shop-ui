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
import {BehaviorSubject, debounceTime, distinctUntilChanged, forkJoin, map, switchMap} from "rxjs";
import {Sort, SortField} from "../../types/sort.type";
import {PageRequest} from "../../types/page-request.type";
import {FormsModule} from "@angular/forms";
import {CardLoaderComponent} from "../../shared/components/card-loader/card-loader.component";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CurrencyPipe,
    TranslateModule,
    ProductCardComponent,
    FormsModule,
    CardLoaderComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  selectedTags: { name: string, slug: string }[] = [];
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

  keyword = ''
  keywordSubject = new BehaviorSubject<string>('');

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
    const sort = {sortBy: this.sortBy, ascending: this.ascending} as Sort

    this.productLoading = true

    this.keywordSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((keyword) =>
        this.productService.searchProducts(pageRequest, sort, {keyword}).pipe(
          switchMap((response) => {
            const products = response.items;

            const imageRequests = products.map((product) =>
              this.productService.getImagesById(product.id).pipe(
                map((images) => {
                  const featuredImage = images.find((img) => img.featured) || images[0];
                  const imageUrl = this.createImageUrl(featuredImage?.imageId)
                  return {productId: product.id, imageUrl};
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
      )
    ).subscribe({
      next: ({pagedProduct, products, imageMap}) => {
        this.pagedProduct = pagedProduct;
        this.products = products;

        this.featuredImageMap = imageMap;
        this.productLoading = false;
      },
      error: () => {
        this.productLoading = false;
      },
    })
  }

  removeTag(slug: string) {
    this.selectedTags = this.selectedTags.filter(tag => tag.slug !== slug);
  }

  removeAllTags() {
    this.selectedTags = []
  }

  addTag(newTag: { name: string, slug: string }): void {
    if (!this.isSelectedTag(newTag)) {
      this.selectedTags.push(newTag);
    }
  }

  isSelectedTag(tag: { name: string, slug: string }) {
    return this.selectedTags.some(selectedTag => selectedTag.slug === tag.slug)
  }

  onKeywordChange(keyword: string) {
    this.router.navigate([], {
      queryParams: {keyword},
      queryParamsHandling: 'merge'
    });
    this.keywordSubject.next(keyword);
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
