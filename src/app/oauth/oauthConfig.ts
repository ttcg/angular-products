import { AuthConfig } from 'angular-oauth2-oidc';

export const OAuthConfig: AuthConfig = {
    issuer: 'https://demo.duendesoftware.com',
    userinfoEndpoint: "https://demo.duendesoftware.com/connect/userinfo",
    redirectUri: window.location.origin + '/home',
    clientId: "interactive.public",
    scope: "openid profile email api offline_access",
    showDebugInformation: true,
    skipIssuerCheck: true,
    responseType: 'code',
    oidc: true
};