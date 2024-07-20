import {Component} from '@angular/core';
import {faStar, faStarHalfAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [FontAwesomeModule, RouterLink],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
    faStar = faStar;
    faStarHalfAlt = faStarHalfAlt;
}
