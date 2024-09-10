import {CanActivateFn, Router} from '@angular/router';
import {KeycloakService} from "keycloak-angular";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route) => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);
    const expectedRoles: string[] = route.data['expectedRoles'];
    const currentRoles: string[] = keycloakService.getUserRoles();

    if (!keycloakService.isLoggedIn()) {
        keycloakService.login();
    }

    if (!expectedRoles || expectedRoles.length === 0) {
        return true;
    }

    if (!currentRoles.some(role => expectedRoles.includes(role.toLowerCase()))) {
        router.navigate(['forbidden']);
        return false;
    }

    return true;
};
