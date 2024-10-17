import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {ProductService} from "../../services/product.service";
import {Product} from "../../types/product.type";
import {Perform} from "../../types/perform.type";
import {Response} from "../../types/response.type";
import {PageRequest} from "../../types/page-request.type";
import {Sort, SortField} from "../../types/sort.type";
import {CurrencyPipe} from "@angular/common";
import {ImageService} from "../../services/image.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CardLoaderComponent} from "../../shared/components/card-loader/card-loader.component";
import {forkJoin, map, switchMap} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";
import {ImageUtils} from "../../shared/services/Image.utils";
import {constant} from "../../shared/constant";

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [RouterLink, CurrencyPipe, TranslateModule, CardLoaderComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {

    productResponse: Response<Product> | null = null;
    heroImages: Map<number, SafeUrl> = new Map();
    pageRequest: PageRequest = {page: 1, size: 10};
    sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};
    loading = false;

    constructor(
        private translate: TranslateService,
        private productService: ProductService,
        private imageService: ImageService,
        private imageUtils: ImageUtils,
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

    savedPrice(product: Product) {
        const gapPrice = product.basePrice - product.salePrice;
        if (gapPrice > 0) {
            return gapPrice;
        }

        return null;
    }

    private fetchProducts(): void {
        this.loading = true;
        this.productService.getBy(this.pageRequest, this.sort).subscribe({
            next: resp => {
                this.productResponse = resp;
                this.loading = false;

                if (resp.items.length) {
                    this.fetchProductHeroImages(resp.items);
                }
            },
            error: () => this.loading = false
        });
    }

    private fetchProductHeroImages(products: Product[]) {
        const heroImageRequests = products.map(product =>
            this.productService.getImagesById(product.id).pipe(
                map(productImages => {
                    const hero = productImages.find(image => image.featured);
                    return hero ? {productId: product.id, heroId: hero.imageId} : null;
                })
            )
        );
        forkJoin(heroImageRequests).subscribe((heroImages) => {
            const validHeroImages = heroImages.filter(image => image != null);
            const imageContentRequests = validHeroImages.map(hero =>
                this.imageService.getById(hero!.heroId).pipe(
                    map(imageContent => ({
                        productId: hero!.productId,
                        safeUrl: this.imageUtils.createSafeUrl(imageContent)
                    }))
                ));

            forkJoin(imageContentRequests).subscribe(imageContents => {
                imageContents.forEach(({productId, safeUrl}) => {
                    this.heroImages.set(productId, safeUrl);
                });
            });
        });
    }

    protected readonly constant = constant;
}
