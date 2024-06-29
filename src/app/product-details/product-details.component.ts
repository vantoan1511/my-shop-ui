import {Component} from '@angular/core';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

    selectedIndex = 0;

    images = [
        'assets/images/product-01.jpg',
        'assets/images/product-01__01.jpg',
        'assets/images/product-01__02.jpg',
        'assets/images/product-01__03.jpg',
    ]

    heroImage = this.images[this.selectedIndex];

    changeHeroImage(thumbnailUrl: string, index: number) {
        this.heroImage = thumbnailUrl;
        this.selectedIndex = index;
    }

}
