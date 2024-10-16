import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
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

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [RouterLink, CurrencyPipe, TranslateModule, CardLoaderComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {

    productResponse: Response<Product> | null = null;
    products$: Perform<Response<Product>> = new Perform<Response<Product>>();
    pageRequest: PageRequest = {page: 1, size: 10};
    sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};
    private loading = false;

    constructor(
        private translate: TranslateService,
        private productService: ProductService,
        private imageService: ImageService
    ) {
        this.translate.setDefaultLang('vi');
    }

    ngOnInit(): void {
        this.products$.load(this.productService.getBy(this.pageRequest, this.sort));
    }

    savedPrice(product: Product) {
        const gapPrice = product.basePrice - product.salePrice;
        if (gapPrice > 0) {
            return gapPrice;
        }

        return null;
    }

}
