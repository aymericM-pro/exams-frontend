import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassApi } from '../../services/class.service';
import { NavigationService } from '../../services/navigation.service';
import { AppRoute } from '../../AppRoute';

@Component({
  standalone: true,
  selector: 'professor-classes',
  imports: [CommonModule],
  templateUrl: './professor-classes.component.html',
  styleUrls: ['./professor-classes.component.scss'],
})
export class ProfessorClassesComponent {
  readonly classApi = inject(ClassApi);
  private readonly navigation = inject(NavigationService);

  openClass(classId: string): void {
    this.navigation.goTo(AppRoute.CLASS_DETAIL, {
      queryParams: { id: classId },
    });
  }

  createClass(): void {
    this.navigation.goTo(AppRoute.CLASS_CREATE);
  }
}
