import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AppRoute } from '../AppRoute';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private readonly router: Router) {}

  goTo(route: AppRoute, extras?: NavigationExtras): void {
    this.router.navigate([route], extras);
  }
}
