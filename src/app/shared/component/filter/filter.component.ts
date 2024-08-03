import {Component, Input} from '@angular/core';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {Product} from "../../../feature/product-list/product";

@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [
        NgSelectModule,
        FormsModule
    ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss'
})
export class FilterComponent {
    @Input() items!: Product[] | null;
    @Input() defaultItems?: number[] | null;
}
