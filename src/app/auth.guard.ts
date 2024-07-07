import {CanActivateFn} from '@angular/router';
import {KeycloakService} from "keycloak-angular";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
    const keycloakService = inject(KeycloakService);
    if (!keycloakService.isLoggedIn()) {
        keycloakService.login();
    }
    return keycloakService.isLoggedIn();
};
