export const environment = {
    production: false,
    keycloak: {
        authority: 'https://103.188.82.99:8443',
        redirectUri: 'http://localhost:4200',
        postLogoutRedirectUri: 'http://localhost:4200/logout',
        realm: 'my-store',
        clientId: 'my-store-ui',
    },
    idleConfig: {idle: 10, timeout: 60, ping: 10},
};