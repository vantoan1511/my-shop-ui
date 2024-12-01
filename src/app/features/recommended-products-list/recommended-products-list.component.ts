import {Component, OnInit} from '@angular/core';
import {CardLoaderComponent} from "../../shared/components/card-loader/card-loader.component";
import {ProductCardComponent} from "../../components/product-card/product-card.component";
import {TranslateModule} from "@ngx-translate/core";
import {Product} from "../../types/product.type";
import {tap} from "rxjs";
import {ProductService} from "../../services/product.service";
import {ImageUtils} from "../../shared/services/Image.utils";

@Component({
  selector: 'app-recommended-products-list',
  standalone: true,
  imports: [
    CardLoaderComponent,
    ProductCardComponent,
    TranslateModule
  ],
  templateUrl: './recommended-products-list.component.html',
  styleUrl: './recommended-products-list.component.scss'
})
export class RecommendedProductsListComponent implements OnInit {
  recommendedProducts: Product[] = [];
  recommendedProductsLoading = false;

  constructor(
    protected imageUtil: ImageUtils,
    private productService: ProductService,
  ) {
  }

  ngOnInit(): void {
    this.fetchRecommendedProducts()
  }

  private fetchRecommendedProducts(): void {
    this.recommendedProductsLoading = true
    this.productService.getRecommendations().pipe(tap(() => this.recommendedProductsLoading = false)).subscribe({
      next: (products) => this.recommendedProducts = products
    })
  }

  protected readonly Array = Array;
}
