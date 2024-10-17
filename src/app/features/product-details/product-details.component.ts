import {Component, OnInit} from '@angular/core';
import {ProductListComponent} from '../product-list/product-list.component';
import {ProductService} from "../../services/product.service";
import {Product} from "../../types/product.type";
import {CurrencyPipe, NgOptimizedImage} from "@angular/common";
import {ImageService} from "../../services/image.service";
import {SafeUrl} from "@angular/platform-browser";
import {constant} from "../../shared/constant";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ImageUtils} from "../../shared/services/Image.utils";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [ProductListComponent, CurrencyPipe, NgOptimizedImage, TranslateModule],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {

    productSlug: string | null = null;
    product: Product | null = null;
    heroUrl: SafeUrl | null = null;
    imageUrls: SafeUrl[] = [];

    constructor(
        private translateService: TranslateService,
        private productService: ProductService,
        private imageService: ImageService,
        private imageUtils: ImageUtils,
        private router: ActivatedRoute
    ) {
        this.translateService.setDefaultLang("vi");
    }

    ngOnInit(): void {
        this.router.params.subscribe(params => {
            this.productSlug = params['slug'];
            if (this.productSlug) {
                this.productService.getBySlug(this.productSlug).subscribe((product: Product) => {
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
        });
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
