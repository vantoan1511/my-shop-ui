import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {ProductCardComponent} from "../product-card/product-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        HeaderComponent,
        ProductCardComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
