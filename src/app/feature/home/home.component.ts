import {Component} from '@angular/core';
import {HeaderComponent} from "../../core/components/header/header.component";
import {ProductCardComponent} from "../products/product-card/product-card.component";
import {ProductListComponent} from "../products/product-list/product-list.component";
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HeaderComponent,
        ProductCardComponent,
        ProductListComponent,
        RouterOutlet
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
}