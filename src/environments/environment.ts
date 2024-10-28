export const environment = {
    production: false,
    keycloak: {
        authority: 'https://103.188.83.167:8443',
        redirectUri: 'http://localhost:4200',
        postLogoutRedirectUri: 'http://localhost:4200/logout',
        realm: 'shopbee',
        clientId: 'shopbee-ui',
    },
    USER_SERVICE_API: 'http://103.188.83.167:8081/api',
    IMAGE_SERVICE_API: 'http://103.188.83.167:8082/api',
    PRODUCT_SERVICE_API: 'http://103.188.83.167:8083/api',
    REVIEW_SERVICE_API: 'http://103.188.83.167:8086/api'
};
