import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {ProductService} from "../../services/product.service";
import {Product} from "../../types/product.type";
import {PagedResponse} from "../../types/response.type";
import {PageRequest} from "../../types/page-request.type";
import {Sort, SortField} from "../../types/sort.type";
import {CurrencyPipe} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CardLoaderComponent} from "../../shared/components/card-loader/card-loader.component";
import {constant} from "../../shared/constant";
import {environment} from "../../../environments/environment";
import {ProductImage} from "../../types/image.type";

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [RouterLink, CurrencyPipe, TranslateModule, CardLoaderComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {

    productResponse: PagedResponse<Product> | null = null;
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
        this.productService.getBy(this.pageRequest, this.sort).subscribe({
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

    protected readonly environment = environment;
}
