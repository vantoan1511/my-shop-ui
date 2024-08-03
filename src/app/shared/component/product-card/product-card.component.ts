import {Component, Input} from '@angular/core';
import {faStar, faStarHalfAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {Product} from "../../../feature/product-list/product";
import {CurrencyPipe} from "@angular/common";

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [FontAwesomeModule, RouterLink, CurrencyPipe],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
    @Input() product!: Product;

    protected readonly faStar = faStar;
    protected readonly faStarHalfAlt = faStarHalfAlt;
}
