import {Component} from '@angular/core';
import {faMagnifyingGlass, faCartShopping} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        FaIconComponent
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    faMagnifyingGlass = faMagnifyingGlass;
    faCartShopping = faCartShopping;
}
