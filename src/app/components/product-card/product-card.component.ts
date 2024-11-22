import {Component, Input} from '@angular/core';
import {constant} from "../../shared/constant";
import {CurrencyPipe, NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Product} from "../../types/product.type";
import {CardLoaderComponent} from "../../shared/components/card-loader/card-loader.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    TranslateModule,
    NgClass,
    CardLoaderComponent,
    RouterLink
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  @Input() loading = false;
  @Input() rating = 0;
  @Input() thumbnail = constant.defaultHeroImageUrl
  @Input() product: Product | null = null;

  get discount() {
    if (this.product) {
      return this.product?.basePrice - this.product?.salePrice;
    }
    return 0;
  }

  protected readonly constant = constant;
  protected readonly Array = Array;
}
