import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const expectedRoles: string[] = route.data['expectedRoles'];
  const currentRoles: string[] = authService.getUserRoles();

  console.log('Expected roles: ', expectedRoles);
  console.log('Current roles: ', currentRoles);

  if (!authService.isAuthenticated) {
    router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
  }

  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  if (!authService.hasAccess(expectedRoles)) {
    router.navigate(['forbidden']);
    return false;
  }

  return true;
};
