import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ClassApi } from '../../services/class.service';
import { NavigationService } from '../../services/navigation.service';
import { AppRoute } from '../../AppRoute';
import { StudentResponse } from '../../services/models/student-responses.model';

@Component({
  selector: 'app-class-users',
  standalone: true,
  templateUrl: './detail-classes.component.html',
  styleUrls: ['./detail-classes.component.scss'],
})
export class DetailClassComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly classApi = inject(ClassApi);
  readonly studentsResource = this.classApi.studentsByClass;
  readonly usersInClass = computed<StudentResponse[]>(
    () => this.studentsResource.value()?.data ?? [],
  );
  readonly loading = computed(() => this.studentsResource.isLoading());
  private readonly navigation = inject(NavigationService);

  constructor() {
    const classId = this.route.snapshot.paramMap.get('id');
    if (classId) {
      this.classApi.setClassId(classId);
    }

    effect(() => {
      console.log('[studentsResource]');
      console.log('loading:', this.studentsResource.isLoading());
      console.log('value:', this.studentsResource.value());
      console.log('error:', this.studentsResource.error());
    });
  }

  goToCreateClass(): void {
    this.navigation.goTo(AppRoute.CLASS_CREATE);
  }

  removeUser(studentId: string): void {
    console.log('remove student', studentId);

    // après DELETE backend
    this.studentsResource.reload();
  }
}
