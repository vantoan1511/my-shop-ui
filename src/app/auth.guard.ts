import {CanActivateFn, Router} from '@angular/router';
import {KeycloakService} from "keycloak-angular";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);
    const expectedRoles: string[] = route.data['expectedRoles'];
    const currentRoles: string[] = keycloakService.getUserRoles();

    console.log('Expected roles: ', expectedRoles);
    console.log('Current roles: ', currentRoles);

    if (!keycloakService.isLoggedIn()) {
        keycloakService.login();
    }

    if (!expectedRoles || expectedRoles.length === 0) {
        return true;
    }

    if (!expectedRoles.every(role => currentRoles.includes(role.toUpperCase()))) {
        router.navigate(['forbidden']);
        return false;
    }

    return true;
};
