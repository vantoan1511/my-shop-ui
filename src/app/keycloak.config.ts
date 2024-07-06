import {KeycloakService} from "keycloak-angular";

export function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
        keycloak.init({
            config: {
                url: 'http://localhost:8080',
                realm: 'my-store',
                clientId: 'my-store-ui'
            },
            initOptions: {
                onLoad: 'login-required',
                silentCheckSsoRedirectUri:
                    window.location.origin + 'silent-check-sso.html'
            }
        });
}