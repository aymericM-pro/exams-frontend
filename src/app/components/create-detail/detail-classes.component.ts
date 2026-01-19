import { Component, computed, effect, inject } from '@angular/core';
import { ClassApi } from '../../services/class.service';
import { NavigationService } from '../../services/navigation.service';
import { AppRoute } from '../../AppRoute';
import { ButtonComponent } from '../ui/app-button.component';
import { I18nService } from '../../services/i18n/I18nService.service';

@Component({
  selector: 'app-class-users',
  standalone: true,
  templateUrl: './detail-classes.component.html',
  styleUrls: ['./detail-classes.component.scss'],
  imports: [ButtonComponent],
})
export class DetailClassComponent {
  readonly i18n = inject(I18nService);
  readonly usersInClass = computed(() => this.studentsResource.value()?.data ?? []);
  readonly loading = computed(() => this.studentsResource.isLoading());
  private readonly classApi = inject(ClassApi);
  readonly studentsResource = this.classApi.studentsByClass;
  private readonly navigation = inject(NavigationService);
  private readonly classId = 'a2b39e6c-f116-45c0-8af9-604f342d80a2';

  constructor() {
    this.classApi.setClassId(this.classId);

    effect(() => {
      const error = this.classApi.removeStudentResource.error();
      const done = this.classApi.removeStudentResource.value();

      if (error) {
        console.error(this.i18n.t().common.deleteError, error);
        return;
      }

      if (done !== undefined) {
        this.studentsResource.reload();
      }
    });
  }

  removeStudent(studentId: string): void {
    this.classApi.removeStudentFromClass(studentId);
  }

  editClass(): void {
    this.navigation.goTo(AppRoute.CLASS_CREATE, {
      queryParams: {
        mode: 'edit',
        classId: this.classId,
      },
    });
  }
}
