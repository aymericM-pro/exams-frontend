import { Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ExamDto, ExamService } from '../../services/exam.service';
import { ExamSessionService } from '../../services/exam-session.service';
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
  readonly exams = computed<ExamDto[]>(() => this.examsResource.value()?.data ?? []);
  readonly loading = computed(() => this.examsResource.isLoading());
  readonly error = computed(() => this.examsResource.error());
  private readonly examService = inject(ExamService);
  readonly examsResource = this.examService.exams;
  private readonly examSessionService = inject(ExamSessionService);
  private readonly navigation = inject(NavigationService);

  startSession(examId: string): void {
    if (!confirm('Start a new session for this exam?')) {
      return;
    }

    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000);

    this.examSessionService.createSession({
      examId,
      classId: 'UUID_DE_LA_CLASSE',
      startAt: now.toISOString(),
      endAt: end.toISOString(),
    });
  }

  openExam(id: string): void {
    this.navigation.goTo(`${AppRoute.EXAMS}/${id}` as AppRoute, { queryParams: { mode: 'view' } });
  }

  editExam(id: string): void {
    this.navigation.goTo(AppRoute.EXAM_BUILDER, { queryParams: { edit: id } });
  }

  deleteExam(id: string): void {
    if (!confirm('Delete this exam?')) return;

    this.examService.deleteExam(id).subscribe(() => {
      this.examsResource.reload();
    });
  }
}
