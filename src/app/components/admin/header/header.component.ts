import {Component} from '@angular/core';
import {RouterLink, RouterModule} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../../services/authentication.service";
import {Role} from "../../../types/role.type";

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  constructor(
    protected authService: AuthenticationService,
    private translate: TranslateService,) {
    this.translate.setDefaultLang("vi")
  }

  logout() {
    this.authService.logout();
  }

  protected readonly Role = Role;
}
