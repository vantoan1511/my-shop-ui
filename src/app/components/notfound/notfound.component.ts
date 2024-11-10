import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule
  ],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss'
})
export class NotfoundComponent {
  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang("vi")
  }
}
