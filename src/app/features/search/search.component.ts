import { Component } from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {constant} from "../../shared/constant";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CurrencyPipe,
    TranslateModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  protected readonly Array = Array;
  protected readonly constant = constant;
}
