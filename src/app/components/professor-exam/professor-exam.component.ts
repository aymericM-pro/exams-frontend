import { Component, effect, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { NavigationService } from '../../services/navigation.service';
import { AppRoute } from '../../AppRoute';

@Component({
  selector: 'app-professor-exams',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './professor-exams.component.html',
  styleUrl: './professor-exams.component.scss',
})
export class ProfessorExamsComponent {
  private readonly examService = inject(ExamService);
  readonly exams = this.examService.exams;
  readonly loading = this.examService.loading;
  readonly error = this.examService.error;
  private readonly navigation = inject(NavigationService);

  constructor() {
    this.examService.loadExams();

    effect(() => {
      console.log('👨‍🏫 Exams:', this.exams());
    });
  }

  openExam(id: string): void {
    this.navigation.goTo(`${AppRoute.EXAMS}/${id}` as AppRoute, { queryParams: { mode: 'view' } });
  }

  editExam(id: string): void {
    this.navigation.goTo(AppRoute.EXAM_BUILDER, { queryParams: { edit: id } });
  }

  deleteExam(id: string): void {
    if (confirm('Delete this exam?')) {
      this.examService.deleteExam(id);
    }
  }
}
