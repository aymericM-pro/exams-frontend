import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AppRoute } from '../AppRoute';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);

  goTo(route: AppRoute, extras?: NavigationExtras): void {
    void this.router.navigate([route], extras);
  }
}
