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
    {
      id: 'professor',
      icon: 'mdi-teach-outline',
      label: 'My Exams',
      path: '/exams/professor',
      exact: true,
    },
    {
      id: 'detail',
      icon: 'mdi-account-group-outline',
      label: 'Classes',
      path: '/classes/detail',
      exact: true,
    },
    {
      id: 'all-classes',
      icon: 'mdi-school-outline',
      label: 'All Classes',
      path: '/classes/all-classes',
      exact: true,
    },
  ];
}
