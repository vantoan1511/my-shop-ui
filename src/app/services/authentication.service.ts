import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {jwtDecode} from "jwt-decode";
import {BehaviorSubject} from "rxjs";
import {Role} from "../types/role.type";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private keycloakUrl = `${environment.keycloak.authority}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;

  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();
  private refreshInProgress = false;

  constructor(
    private http: HttpClient,
  ) {
  }

  async login(username: string, password: string) {
    const body = new HttpParams()
      .set('client_id', environment.keycloak.clientId)
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    try {
      const response = await this.http.post<GetTokenResponse>(this.keycloakUrl, body, {headers}).toPromise() as GetTokenResponse;
      this.storeTokens(response.access_token, response.refresh_token)
      this.authenticatedSubject.next(true);
    } catch (error) {
      this.authenticatedSubject.next(false);
      console.error('Login failed', error);
      throw error;
    }
  }

  async refreshToken(): Promise<void> {
    if (this.refreshInProgress) {
      return;
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const body = new HttpParams()
      .set('client_id', environment.keycloak.clientId)
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    this.refreshInProgress = true;

    try {
      const response = await this.http.post<GetTokenResponse>(this.keycloakUrl, body, {headers}).toPromise() as GetTokenResponse;
      this.storeTokens(response.access_token, response.refresh_token);
      this.authenticatedSubject.next(true);
    } catch (error) {
      console.error('Token refresh failed', error);
      this.authenticatedSubject.next(false);
      this.logout();
      throw error;
    } finally {
      this.refreshInProgress = false;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    this.authenticatedSubject.next(false);
    window.location.href = "/login";
  }

  getUserRoles(): string[] {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      return decodedToken.realm_access?.roles || [];
    }
    return [];
  }

  hasAccess(expectedRoles: string[]) {
    const currentRoles = this.getUserRoles();
    return currentRoles.some((role) => expectedRoles.includes(role))
  }

  setRedirectUrl(url: string): void {
    localStorage.setItem('redirect_url', url);
  }

  getRedirectUrl(): string | null {
    const url = localStorage.getItem('redirect_url');
    localStorage.removeItem('redirect_url');
    return url;
  }

  checkAuthenticated() {
    this.authenticatedSubject.next(this.isAuthenticated);
  }

  get isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes(Role.ADMIN)
  }

  get isStaff() {
    const roles = this.getUserRoles();
    return roles.includes(Role.STAFF)
  }

  get isAuthenticated(): boolean {
    const expiresAt = parseInt(localStorage.getItem('expires_at') || '0', 10);
    return Date.now() < expiresAt;
  }

  get username(): string {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      return decodedToken.preferred_username || '';
    }
    return '';
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    const decodedToken: any = jwtDecode(accessToken);
    const expiresAt = decodedToken.exp * 1000;

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expires_at', expiresAt.toString());
  }
}

interface GetTokenResponse {
  access_token: string;
  refresh_token: string
}
