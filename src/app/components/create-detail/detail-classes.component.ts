import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppRoute } from '../../AppRoute';
import { NavigationService } from '../../services/navigation.service';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ClassDetail {
  id: string;
  name: string;
  year: string;
}

interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-class-users',
  standalone: true,
  templateUrl: './detail-classes.component.html',
  styleUrls: ['./detail-classes.component.scss'],
  imports: [DatePipe],
})
export class DetailClassComponent {
  // ---- State
  readonly loading = signal(true);
  readonly classDetail = signal<ClassDetail | null>(null);

  readonly usersInClass = signal<Student[]>([]);
  readonly availableUsers = signal<Student[]>([]);
  readonly selectedUserId = signal<string | null>(null);

  private readonly navigationService = inject(NavigationService);

  constructor(route: ActivatedRoute) {
    const classId = route.snapshot.paramMap.get('id')!;

    // ---- Simulated API calls (à remplacer)
    this.classDetail.set({
      id: classId,
      name: 'M1 Computer Science',
      year: '2025',
    });

    this.usersInClass.set([
      {
        id: '1',
        studentNumber: 'STU-2025-001',
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice.martin@mail.com',
        birthDate: '2002-04-12',
        age: 22,
        gender: 'Female',
        status: 'Active',
      },
      {
        id: '2',
        studentNumber: 'STU-2025-002',
        firstName: 'Bob',
        lastName: 'Durand',
        email: 'bob.durand@mail.com',
        birthDate: '2001-11-03',
        age: 23,
        gender: 'Male',
        status: 'Active',
      },
      {
        id: '3',
        studentNumber: 'STU-2025-003',
        firstName: 'Charlie',
        lastName: 'Petit',
        email: 'charlie.petit@mail.com',
        birthDate: '2003-01-19',
        age: 21,
        gender: 'Male',
        status: 'Active',
      },
      {
        id: '4',
        studentNumber: 'STU-2025-004',
        firstName: 'Diana',
        lastName: 'Leroy',
        email: 'diana.leroy@mail.com',
        birthDate: '2002-07-08',
        age: 22,
        gender: 'Female',
        status: 'Active',
      },
      {
        id: '5',
        studentNumber: 'STU-2025-005',
        firstName: 'Ethan',
        lastName: 'Moreau',
        email: 'ethan.moreau@mail.com',
        birthDate: '2000-09-27',
        age: 24,
        gender: 'Male',
        status: 'Inactive',
      },
      {
        id: '6',
        studentNumber: 'STU-2025-006',
        firstName: 'Fanny',
        lastName: 'Rousseau',
        email: 'fanny.rousseau@mail.com',
        birthDate: '2001-02-15',
        age: 23,
        gender: 'Female',
        status: 'Active',
      },
      {
        id: '7',
        studentNumber: 'STU-2025-007',
        firstName: 'Gabriel',
        lastName: 'Fontaine',
        email: 'gabriel.fontaine@mail.com',
        birthDate: '2002-12-01',
        age: 22,
        gender: 'Male',
        status: 'Active',
      },
      {
        id: '8',
        studentNumber: 'STU-2025-008',
        firstName: 'Hugo',
        lastName: 'Bernard',
        email: 'hugo.bernard@mail.com',
        birthDate: '2003-05-21',
        age: 21,
        gender: 'Male',
        status: 'Active',
      },
      {
        id: '9',
        studentNumber: 'STU-2025-009',
        firstName: 'Inès',
        lastName: 'Lopez',
        email: 'ines.lopez@mail.com',
        birthDate: '2001-08-30',
        age: 23,
        gender: 'Female',
        status: 'Inactive',
      },
      {
        id: '10',
        studentNumber: 'STU-2025-010',
        firstName: 'Julien',
        lastName: 'Carpentier',
        email: 'julien.carpentier@mail.com',
        birthDate: '2000-03-10',
        age: 24,
        gender: 'Male',
        status: 'Active',
      },
    ]);

    this.loading.set(false);
  }

  goToCreateClass(): void {
    this.navigationService.goTo(AppRoute.CLASS_CREATE);
  }

  removeUser(userId: string): void {
    const user = this.usersInClass().find((u) => u.id === userId);
    if (!user) return;

    // DELETE /classes/{id}/users/{userId}
    this.usersInClass.update((list) => list.filter((u) => u.id !== userId));
    this.availableUsers.update((list) => [...list, user]);
  }
}
