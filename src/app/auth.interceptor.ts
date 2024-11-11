import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthenticationService} from "./services/authentication.service";
import {catchError, from, switchMap, throwError} from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);

  const expiresAt = parseInt(localStorage.getItem('expires_at') || '0', 10);
  const now = Date.now();

  if (expiresAt && expiresAt < now) {
    return from(authService.refreshToken()).pipe(
      switchMap(() => {
        const accessToken = localStorage.getItem('access_token');
        const clonedRequest = accessToken
          ? req.clone({setHeaders: {Authorization: `Bearer ${accessToken}`}})
          : req;
        return next(clonedRequest);
      }),
      catchError(error => {
        console.error('Token refresh failed', error);
        return throwError(() => error);
      })
    );
  } else {
    const accessToken = localStorage.getItem('access_token');
    const clonedRequest = accessToken
      ? req.clone({setHeaders: {Authorization: `Bearer ${accessToken}`}})
      : req;

    return next(clonedRequest).pipe(
      catchError(error => {
        if (error.status === 401) {
          console.warn('Unauthorized request');
        }
        return throwError(() => error);
      })
    );
  }
};
