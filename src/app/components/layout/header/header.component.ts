import {
  Component,
  ElementRef,
  HostListener,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  userName = signal('Mia Lore');
  userEmail = signal('mia.lore@example.com');
  menuOpen = signal(false);

  isAuthenticated = computed(() => !!localStorage.getItem('token'));

  userInitials = computed(() =>
    this.userName()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  );

  constructor(
    private router: Router,
    private el: ElementRef,
  ) {}


  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.update(v => !v);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  handleProfile(): void {
    this.menuOpen.set(false);
    this.router.navigate(['/profile']);
  }

  handleSettings(): void {
    this.menuOpen.set(false);
    this.router.navigate(['/settings']);
  }

  handleLogout(): void {
    localStorage.removeItem('token');
    this.menuOpen.set(false);
    this.router.navigate(['/signin']);
  }
}
