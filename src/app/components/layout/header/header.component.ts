import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';
import { AppRoute } from '../../../AppRoute';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userName = signal('Mia Lore');
  userEmail = signal('mia.lore@example.com');
  menuOpen = signal(false);
  isAuthenticated = computed(() => !!localStorage.getItem('token'));
  userInitials = computed(() =>
    this.userName()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase(),
  );
  private readonly navigation = inject(NavigationService);
  private readonly el = inject(ElementRef);

  // ===== menu =====
  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  // ===== navigation =====
  handleProfile(): void {
    this.closeMenu();
    this.navigation.goTo(AppRoute.PROFILE);
  }

  handleSettings(): void {
    this.closeMenu();
    this.navigation.goTo(AppRoute.SETTINGS);
  }

  handleLogout(): void {
    localStorage.removeItem('token');
    this.closeMenu();
    this.navigation.goTo(AppRoute.SIGNIN);
  }

  private closeMenu(): void {
    this.menuOpen.set(false);
  }
}
