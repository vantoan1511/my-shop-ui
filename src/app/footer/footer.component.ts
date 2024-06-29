import {Component} from '@angular/core';
import {faHeart} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [FontAwesomeModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    faHeart = faHeart;
}
