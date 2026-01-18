import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ClassApi } from '../../services/class.service';
import { UserApi } from '../../services/user.service';
import { CreateClassRequest } from '../../services/models/create-class.model';
import { IdentityUser } from '../../services/models/identity-user.model';

type ClassLevel = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';

@Component({
  standalone: true,
  selector: 'create-classes',
  templateUrl: './create-classes.component.html',
  styleUrls: ['./create-classes.component.scss'],
  imports: [FormsModule],
})
export class CreateClassComponent {
  readonly level = signal<ClassLevel>('M1');
  readonly year = signal('');
  readonly description = signal('');

  readonly allStudents = signal<IdentityUser[]>([]);
  readonly filteredStudents = signal<IdentityUser[]>([]);
  readonly selectedStudents = signal<IdentityUser[]>([]);

  readonly allProfessors = signal<IdentityUser[]>([]);
  readonly filteredProfessors = signal<IdentityUser[]>([]);
  readonly selectedProfessors = signal<IdentityUser[]>([]);

  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  private readonly router = inject(Router);
  private readonly classApi = inject(ClassApi);
  private readonly userApi = inject(UserApi);

  constructor() {
    effect(() => {
      this.loading.set(true);

      this.userApi.getIdentityUsers().subscribe({
        next: (res) => {
          if (!res.success || !res.data) {
            this.error.set('Failed to load users');
            return;
          }

          const unique = Array.from(new Map(res.data.map((u) => [u.identityId, u])).values());

          this.allStudents.set(unique.filter((u) => u.roles?.includes('STUDENT')));
          this.allProfessors.set(unique.filter((u) => u.roles?.includes('PROF')));
        },
        error: () => this.error.set('Server error while loading users'),
        complete: () => this.loading.set(false),
      });
    });
  }

  searchStudents(query: string): void {
    this.filteredStudents.set(this.filterUsers(query, this.allStudents(), this.selectedStudents()));
  }

  searchProfessors(query: string): void {
    this.filteredProfessors.set(
      this.filterUsers(query, this.allProfessors(), this.selectedProfessors()),
    );
  }

  addStudent(u: IdentityUser) {
    this.selectedStudents.update((v) => [...v, u]);
    this.filteredStudents.set([]);
  }

  removeStudent(u: IdentityUser) {
    this.selectedStudents.update((v) => v.filter((x) => x.identityId !== u.identityId));
  }

  addProfessor(u: IdentityUser) {
    this.selectedProfessors.update((v) => [...v, u]);
    this.filteredProfessors.set([]);
  }

  removeProfessor(u: IdentityUser) {
    this.selectedProfessors.update((v) => v.filter((x) => x.identityId !== u.identityId));
  }

  submit(): void {
    if (!this.level() || !this.year()) return;

    this.submitting.set(true);
    this.error.set(null);

    const payload: CreateClassRequest = {
      name: this.level(),
      graduationYear: this.year(),
      studentIds: this.selectedStudents().map((u) => u.identityId),
      professorIds: this.selectedProfessors().map((u) => u.identityId),
    };

    this.classApi.create(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/classes']);
        } else {
          this.error.set('Invalid request');
        }
      },
      error: () => this.error.set('Server error'),
      complete: () => this.submitting.set(false),
    });
  }

  cancel(): void {
    this.router.navigate(['/classes']);
  }

  private filterUsers(
    query: string,
    source: IdentityUser[],
    selected: IdentityUser[],
  ): IdentityUser[] {
    if (!query) return [];

    const q = query.toLowerCase();

    return source
      .filter(
        (u) =>
          u.firstname?.toLowerCase().includes(q) ||
          u.lastname?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q),
      )
      .filter((u) => !selected.some((s) => s.identityId === u.identityId));
  }
}
