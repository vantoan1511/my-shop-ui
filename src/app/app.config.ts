import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {KeycloakService} from "keycloak-angular";
import {environment} from "../environments/environment";
import {provideHttpClient} from "@angular/common/http";

export const initializeKeycloak = (keycloak: KeycloakService) => async () =>
    keycloak.init({
        config: {
            url: environment.keycloak.authority,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId,
        },
        loadUserProfileAtStartUp: true,
        initOptions: {
            onLoad: 'login-required',
            flow: 'standard',
            // silentCheckSsoRedirectUri:
            //     window.location.origin + '/silent-check-sso.html',
            // checkLoginIframe: false,
            // redirectUri: environment.keycloak.redirectUri,
        },
    });

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService],
        },
        KeycloakService,
        provideHttpClient()
    ]
};
