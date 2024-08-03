import {Component} from '@angular/core';
import {faArrowRightFromBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AuthService} from "../../../core/auth.service";
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        FaIconComponent,
        RouterLink,
        NgOptimizedImage
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    faLogout = faArrowRightFromBracket;
    faUser = faUser;

    constructor(protected readonly authService: AuthService) {
    }
}
