import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthService } from 'src/app/services';

@Injectable({ providedIn: 'root' })
export class ProjectGuard implements CanActivate {
  authService = inject(AuthService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredProject = route.data['project'];
    const activeProject = this.authService.getAppTypeFromStorage();
    console.log(activeProject, requiredProject);

    if (activeProject === requiredProject) {
      return true;
    }

    return false; // or redirect
  }
}
