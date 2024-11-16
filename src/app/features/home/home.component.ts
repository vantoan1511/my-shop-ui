import { Component } from '@angular/core';
import {ProductListComponent} from "../product-list/product-list.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgTemplateOutlet} from "@angular/common";
import {BannerComponent} from "../../components/banner/banner.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductListComponent,
    TranslateModule,
    NgTemplateOutlet,
    BannerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
