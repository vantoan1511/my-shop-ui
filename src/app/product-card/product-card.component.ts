import {Component} from '@angular/core';
import {faStar, faStarHalfAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [FontAwesomeModule],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
    faStar = faStar;
    faStarHalfAlt = faStarHalfAlt;
}
