import {Component, HostBinding, Input} from '@angular/core';

@Component({
    selector: 'app-product-image',
    standalone: true,
    imports: [],
    templateUrl: './product-image.component.html',
    styleUrl: './product-image.component.scss'
})
export class ProductImageComponent {
    @HostBinding('class') className = 'col-md-5 product-images';

    @Input() images: string[] | null = [];
    @Input() heroImage: string | null = null;

    selectedIndex = 0;

    changeHeroImage(thumbnailUrl: string, index: number) {
        this.heroImage = thumbnailUrl;
        this.selectedIndex = index;
    }

}
