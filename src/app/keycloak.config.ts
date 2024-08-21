import {KeycloakService} from "keycloak-angular";
import {environment} from "../environments/environment";

export const initializeKeycloak = (keycloak: KeycloakService) => async () =>
    await keycloak.init({
        config: {
            url: environment.keycloak.authority,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId,
        },
        loadUserProfileAtStartUp: true,
        bearerPrefix: "Bearer",
        enableBearerInterceptor: true,
        authorizationHeaderName: "Authorization",
        initOptions: {
            onLoad: 'check-sso',
            enableLogging: true,
            checkLoginIframe: true,
            silentCheckSsoRedirectUri:
                window.location.origin + '/silent-check-sso.html',
            redirectUri: window.location.href,
        },
    });
