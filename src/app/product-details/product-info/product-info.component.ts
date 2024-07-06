import {Component, HostBinding, Input} from '@angular/core';
import {faCartPlus, faStar, faStarHalfAlt} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
    selector: 'app-product-info',
    standalone: true,
    imports: [
        FaIconComponent
    ],
    templateUrl: './product-info.component.html',
    styleUrl: './product-info.component.scss'
})
export class ProductInfoComponent {

    @HostBinding('class') className = 'col-md-7 product-details';

    @Input() images: string[] = [];

    selectedColor = -1;

    selectedSize = -1;

    changeSelectedColor(thumbnailUrl: string, index: number) {
        // this.changeHeroImage(thumbnailUrl, index);
        this.selectedColor = index;
    }

    changeSelectedSize(index: number) {
        this.selectedSize = index;
    }

    protected readonly faCartPlus = faCartPlus;
    protected readonly faStarHalfAlt = faStarHalfAlt;
    protected readonly faStar = faStar;

}
