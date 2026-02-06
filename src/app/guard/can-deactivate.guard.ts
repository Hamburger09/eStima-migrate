import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../interfaces/can-component-deactivate';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate | null
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (!component) {
      return true; // if no component, just allow navigation
    }
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
