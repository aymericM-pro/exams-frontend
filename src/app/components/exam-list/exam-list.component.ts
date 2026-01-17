import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExamService } from '../../services/exam.service';
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
  // ===== UI state =====
  readonly semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
  readonly selectedSemester = signal('S1');
  readonly filteredExams = computed(() =>
    this.exams().filter((e) => e.semester === this.selectedSemester()),
  );
  // ===== services =====
  private readonly examService = inject(ExamService);
  // ===== data =====
  readonly exams = this.examService.exams;
  readonly loading = this.examService.loading;
  readonly error = this.examService.error;
  private readonly navigation = inject(NavigationService);

  constructor() {
    this.examService.loadExams();

    effect(() => {
      console.log('📚 Exams:', this.exams());
    });
  }

  // ===== actions =====
  selectSemester(semester: string): void {
    this.selectedSemester.set(semester);
  }

  openExam(id: string): void {
    this.navigation.goTo(`${AppRoute.EXAMS}/${id}` as AppRoute);
  }

  deleteExam(id: string): void {
    if (confirm('Delete this exam?')) {
      this.examService.deleteExam(id);
    }
  }
}
