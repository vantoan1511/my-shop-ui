import {Component, Input, OnInit} from '@angular/core';
import {ProductListComponent} from '../product-list/product-list.component';
import {ProductService} from "../../services/product.service";
import {Observable} from "rxjs";
import {Product} from "../../types/product.type";
import {CurrencyPipe, NgOptimizedImage} from "@angular/common";
import {ImageService} from "../../services/image.service";
import {SafeUrl} from "@angular/platform-browser";
import {constant} from "../../shared/constant";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ImageUtils} from "../../shared/services/Image.utils";

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [ProductListComponent, CurrencyPipe, NgOptimizedImage, TranslateModule],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {

    productSlug: string | null = null;
    product$: Observable<Product> | null = null;
    product: Product | null = null;
    heroUrl: SafeUrl | null = null;
    imageUrls: SafeUrl[] = [];

    @Input()
    set slug(productSlug: string) {
        if (productSlug && productSlug !== 'new') {
            this.productSlug = productSlug;
            this.product$ = this.productService.getBySlug(productSlug);
        }
    }

    constructor(
        private translateService: TranslateService,
        private productService: ProductService,
        private imageService: ImageService,
        private imageUtils: ImageUtils
    ) {
        this.translateService.setDefaultLang("vi");
    }

    ngOnInit(): void {
        this.product$?.subscribe((product: Product) => {
            console.log(product)
            this.product = product;

            this.productService.getImagesById(product.id).subscribe((productImages) => {
                productImages.forEach(image => {
                    this.imageService.getById(image.imageId).subscribe(imageContent => {
                        const url = this.imageUtils.createSafeUrl(imageContent)
                        this.imageUrls.push(url);

                        if (image.featured) {
                            this.heroUrl = url;
                        }
                    })
                })
            });
        })
    }

    onHoverThumbnail(index: number) {
        this.heroUrl = this.imageUrls[index];
    }

    get discount(): number {
        if (this.product) {
            return Math.round((1 - (this.product?.salePrice / this.product?.basePrice)) * 100)
        }
        return 0;
    }

    protected readonly constant = constant;
}
