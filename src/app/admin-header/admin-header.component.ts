import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {
    faArrowRightFromBracket,
    faBoxesStacked,
    faCompass,
    faUsers,
    faReceipt
} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
    selector: 'app-admin-header',
    standalone: true,
    imports: [
        FaIconComponent,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './admin-header.component.html',
    styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {

    constructor(protected readonly authService: AuthService) {
    }

    protected readonly faLogout = faArrowRightFromBracket;
    protected readonly faDashboard = faCompass;
    protected readonly faUsers = faUsers;
    protected readonly faProducts = faBoxesStacked;
    protected readonly faOrders = faReceipt;
}
