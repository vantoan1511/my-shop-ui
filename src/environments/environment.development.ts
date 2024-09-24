export const environment = {
  production: false,
  keycloak: {
    authority: 'https://103.188.83.154:8443',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200/logout',
    realm: 'shopbee',
    clientId: 'shopbee-ui',
  },
  SERVICE_API_URL: 'http://localhost:8081/api',
};
