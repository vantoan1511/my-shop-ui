import {Injectable} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private readonly keycloakService: KeycloakService) {
    }

    get username(): string {
        return this.keycloakService.getUsername();
    }

    get authenticated(): boolean {
        return this.keycloakService.isLoggedIn();
    }

    get hasAdminPermission(): boolean {
        return this.keycloakService.isUserInRole("admin");
    }

    async login() {
        await this.keycloakService.login();
    }

    async logout() {
        await this.keycloakService.logout();
    }

    async register() {
        await this.keycloakService.register();
    }
}
