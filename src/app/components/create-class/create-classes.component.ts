import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ClassApi } from '../../services/class.service';
import { UserApi } from '../../services/user.service';
import { CreateClassRequest } from '../../services/models/create-class.model';
import { IdentityUser } from '../../services/models/identity-user.model';
import { NavigationService } from '../../services/navigation.service';
import { AppRoute } from '../../AppRoute';

type ClassLevel = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
type Mode = 'add' | 'edit';

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
  readonly studentQuery = signal('');
  readonly professorQuery = signal('');
  readonly selectedStudents = signal<IdentityUser[]>([]);
  readonly selectedProfessors = signal<IdentityUser[]>([]);
  readonly filteredStudents = computed(() =>
    this.filterUsers(this.studentQuery(), this.students(), this.selectedStudents()),
  );
  readonly filteredProfessors = computed(() =>
    this.filterUsers(this.professorQuery(), this.professors(), this.selectedProfessors()),
  );
  private readonly route = inject(ActivatedRoute);
  readonly mode = signal<Mode>(
    this.route.snapshot.queryParamMap.get('mode') === 'edit' ? 'edit' : 'add',
  );
  readonly isEditMode = computed(() => this.mode() === 'edit');
  readonly classId = signal<string | null>(this.route.snapshot.queryParamMap.get('classId'));
  private readonly userApi = inject(UserApi);
  readonly usersResource = this.userApi.identityUsers;
  readonly students = computed<IdentityUser[]>(() =>
    (this.usersResource.value()?.data ?? []).filter((u) => u.roles?.includes('STUDENT')),
  );
  readonly professors = computed<IdentityUser[]>(() =>
    (this.usersResource.value()?.data ?? []).filter((u) => u.roles?.includes('PROF')),
  );
  private readonly classApi = inject(ClassApi);
  readonly classResource = this.classApi.classById;
  readonly classValue = computed(() => this.classResource.value()?.data);
  private readonly navigation = inject(NavigationService);

  constructor() {
    if (this.isEditMode() && this.classId()) {
      this.classApi.setClassId(this.classId()!);
    }

    effect(() => {
      if (!this.isEditMode()) return;

      const cls = this.classValue();
      const users = this.usersResource.value()?.data;

      if (!cls || !users) return;

      this.level.set(cls.name as ClassLevel);
      this.year.set(cls.graduationYear);

      this.selectedStudents.set(users.filter((u) => cls.studentIds.includes(u.identityId)));

      this.selectedProfessors.set(users.filter((u) => cls.professorIds.includes(u.identityId)));
    });

    // navigation après save
    effect(() => {
      const result = this.classApi.saveClassResource.value();
      if (!result) return;

      this.navigation.goTo(AppRoute.CLASS_DETAIL);
    });
  }

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

    const payload: CreateClassRequest = {
      name: this.level(),
      graduationYear: this.year(),
      studentIds: this.selectedStudents().map((u) => u.identityId),
      professorIds: this.selectedProfessors().map((u) => u.identityId),
    };

    this.isEditMode()
      ? this.classApi.update(this.classId()!, payload)
      : this.classApi.create(payload);
  }

  cancel(): void {
    this.navigation.goTo(AppRoute.EXAMS);
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
