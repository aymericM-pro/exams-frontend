import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  path: string;
  exact: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      id: 'exams',
      icon: 'mdi-file-document-outline',
      label: 'Exams',
      path: '/exams',
      exact: true,
    },
    {
      id: 'upcoming',
      icon: 'mdi-play-circle-outline',
      label: 'Upcoming Exams',
      path: '/exams/upcoming',
      exact: true,
    },
  ];
}
