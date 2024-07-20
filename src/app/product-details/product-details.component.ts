import {Component} from '@angular/core';
import {ProductImageComponent} from "./product-image/product-image.component";
import {ProductInfoComponent} from "./product-info/product-info.component";
import {ProductActionComponent} from "./product-action/product-action.component";

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [
        ProductImageComponent,
        ProductInfoComponent,
        ProductActionComponent
    ],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

    selectedIndex = 0;

    selectedColor = -1;

    selectedSize = -1;

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

    changeSelectedColor(thumbnailUrl: string, index: number) {
        this.changeHeroImage(thumbnailUrl, index);
        this.selectedColor = index;
    }

    changeSelectedSize(index: number) {
        this.selectedSize = index;
    }

}
