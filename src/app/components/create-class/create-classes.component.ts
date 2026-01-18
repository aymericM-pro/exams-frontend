import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClassApi } from '../../services/class.service';
import { UserApi } from '../../services/user.service';
import { CreateClassRequest } from '../../services/models/create-class.model';
import { IdentityUser } from '../../services/models/identity-user.model';
import { NavigationService } from '../../services/navigation.service';
import { AppRoute } from '../../AppRoute';

type ClassLevel = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';

@Component({
  standalone: true,
  selector: 'create-classes',
  templateUrl: './create-classes.component.html',
  styleUrls: ['./create-classes.component.scss'],
  imports: [FormsModule],
})
export class CreateClassComponent {
  // ----------------------------------------------------
  // FORM STATE
  // ----------------------------------------------------
  readonly level = signal<ClassLevel>('M1');
  readonly year = signal('');
  readonly description = signal('');

  // ----------------------------------------------------
  // USERS (resource)
  readonly students = computed<IdentityUser[]>(() =>
    (this.usersResource.value()?.data ?? []).filter((u) => u.roles?.includes('STUDENT')),
  );
  readonly professors = computed<IdentityUser[]>(() =>
    (this.usersResource.value()?.data ?? []).filter((u) => u.roles?.includes('PROF')),
  );
  // ----------------------------------------------------
  readonly studentQuery = signal('');
  readonly professorQuery = signal('');

  // ----------------------------------------------------
  // SEARCH
  // ----------------------------------------------------
  readonly selectedStudents = signal<IdentityUser[]>([]);
  readonly filteredStudents = computed(() =>
    this.filterUsers(this.studentQuery(), this.students(), this.selectedStudents()),
  );
  readonly selectedProfessors = signal<IdentityUser[]>([]);
  readonly filteredProfessors = computed(() =>
    this.filterUsers(this.professorQuery(), this.professors(), this.selectedProfessors()),
  );

  // ----------------------------------------------------
  // SELECTION
  // ----------------------------------------------------
  readonly submitting = signal(false);
  // ----------------------------------------------------
  private readonly userApi = inject(UserApi);

  // ----------------------------------------------------
  // UI
  readonly usersResource = this.userApi.identityUsers;

  // ----------------------------------------------------
  // DEPENDENCIES
  // ----------------------------------------------------
  private readonly classApi = inject(ClassApi);
  private readonly navigation = inject(NavigationService);

  // ----------------------------------------------------
  // ACTIONS
  // ----------------------------------------------------
  addStudent(user: IdentityUser): void {
    this.selectedStudents.update((v) => [...v, user]);
    this.studentQuery.set('');
  }

  removeStudent(user: IdentityUser): void {
    this.selectedStudents.update((v) => v.filter((u) => u.identityId !== user.identityId));
  }

  addProfessor(user: IdentityUser): void {
    this.selectedProfessors.update((v) => [...v, user]);
    this.professorQuery.set('');
  }

  removeProfessor(user: IdentityUser): void {
    this.selectedProfessors.update((v) => v.filter((u) => u.identityId !== user.identityId));
  }

  submit(): void {
    if (!this.level() || !this.year()) return;

    this.submitting.set(true);

    const payload: CreateClassRequest = {
      name: this.level(),
      graduationYear: this.year(),
      studentIds: this.selectedStudents().map((u) => u.identityId),
      professorIds: this.selectedProfessors().map((u) => u.identityId),
    };

    this.classApi.create(payload).subscribe(() => {
      this.navigation.goTo(AppRoute.CLASS_DETAIL);
      this.submitting.set(false);
    });
  }

  cancel(): void {
    this.navigation.goTo(AppRoute.EXAMS);
  }

  // ----------------------------------------------------
  // UTILS
  // ----------------------------------------------------
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
