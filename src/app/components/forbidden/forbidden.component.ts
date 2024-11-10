import {Component} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink
  ],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang("vi")
  }

}
