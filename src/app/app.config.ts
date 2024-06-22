import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {KeycloakService} from "keycloak-angular";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://13.229.125.66:8443',
        realm: 'my-store',
        clientId: 'my-store-ui'
      },
      initOptions: {
        checkLoginIframe: false,
        pkceMethod: 'S256',
        onLoad: 'login-required',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html'
      }
    });
}

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
    KeycloakService, provideAnimationsAsync()
  ]
};
