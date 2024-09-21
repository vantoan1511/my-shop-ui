import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private keycloak: KeycloakService) {}

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }

  get isAdmin() {
    return this.keycloak.isUserInRole('ADMIN');
  }

  get isAuthenticated() {
    return this.keycloak.isLoggedIn();
  }

  get username() {
    return this.keycloak.getUsername();
  }
}
