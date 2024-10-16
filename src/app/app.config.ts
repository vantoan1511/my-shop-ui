import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection,} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi,} from '@angular/common/http';
import {KeycloakBearerInterceptor, KeycloakService} from 'keycloak-angular';
import {routes} from './app.routes';
import {initializeKeycloak} from './keycloak.config';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
    new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes, withComponentInputBinding()),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService],
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: KeycloakBearerInterceptor,
            multi: true,
        },
        importProvidersFrom([TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient],
            },
        })]),
        KeycloakService,
        provideHttpClient(withInterceptorsFromDi()),
    ],
};
