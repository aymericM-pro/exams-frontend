import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ExamDto, ExamService } from '../../services/exam.service';
import { NavigationService } from '../../services/navigation.service';
import { AppRoute } from '../../AppRoute';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.scss',
})
export class ExamListComponent {
  readonly semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
  readonly selectedSemester = signal('S1');
  readonly filteredExams = computed(() =>
    this.exams().filter((e) => e.semester === this.selectedSemester()),
  );
  private readonly examService = inject(ExamService);
  readonly examsResource = this.examService.exams;
  readonly exams = computed<ExamDto[]>(() => this.examsResource.value()?.data ?? []);
  readonly loading = computed(() => this.examsResource.isLoading());
  readonly error = computed(() => this.examsResource.error());
  private readonly navigation = inject(NavigationService);

  selectSemester(semester: string): void {
    this.selectedSemester.set(semester);
  }

  openExam(id: string): void {
    this.navigation.goTo(`${AppRoute.EXAMS}/${id}` as AppRoute);
  }

  deleteExam(id: string): void {
    if (!confirm('Delete this exam?')) return;

    this.examService.deleteExam(id).subscribe(() => {
      this.examsResource.reload();
    });
  }
}
