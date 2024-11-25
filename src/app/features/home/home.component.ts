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
import {ProductImage} from "../../types/image.type";
import {environment} from "../../../environments/environment";
import {ProductCardComponent} from "../../components/product-card/product-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductListComponent,
    TranslateModule,
    NgTemplateOutlet,
    BannerComponent,
    ProductCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  productResponse: PagedResponse<Product> | null = null;
  products: Product[] = [];
  heroImages: Map<number, string> = new Map();
  pageRequest: PageRequest = {page: 1, size: 10};
  sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};
  loading = false;

  constructor(
    private translate: TranslateService,
    private productService: ProductService,
    private router: Router
  ) {
    this.translate.setDefaultLang('vi');
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  private fetchProducts(): void {
    this.loading = true;
    this.productService.getProductByCriteria(this.pageRequest, this.sort).subscribe({
      next: response => {
        this.productResponse = response;
        this.fetchProductHeroImages(response);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }


  private fetchProductHeroImages(response: PagedResponse<Product>) {
    if (response.items) {
      const products = response.items;
      products.forEach(product => {
          this.setDefaultHeroImageUrl(product)
          this.productService.getImagesById(product.id).subscribe(productImages => {
            this.heroImages.set(product.id, constant.defaultHeroImageUrl);
            const hero = productImages.find(image => image.featured);
            if (hero) {
              const heroUrl = this.createHeroUrl(hero);
              this.heroImages.set(product.id, heroUrl);
            }
          })
        }
      );
    }
  }

  private setDefaultHeroImageUrl(product: Product) {
    this.heroImages.set(product.id, constant.defaultHeroImageUrl);
  }

  private createHeroUrl(productImage: ProductImage) {
    return `${environment.IMAGE_SERVICE_API}/images/${productImage.imageId}`;
  }

  protected savedPrice(product: Product) {
    const gapPrice = product.basePrice - product.salePrice;
    if (gapPrice > 0) {
      return gapPrice;
    }

    return null;
  }

  protected readonly Array = Array;
  protected readonly constant = constant;
}
