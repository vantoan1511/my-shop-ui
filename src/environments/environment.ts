export const environment = {
    production: false,
    keycloak: {
        authority: 'https://103.205.60.146:8443',
        redirectUri: 'http://localhost:4200',
        postLogoutRedirectUri: 'http://localhost:4200/logout',
        realm: 'my-store',
        clientId: 'my-store-ui',
    },
    idleConfig: {idle: 10, timeout: 60, ping: 10},
};