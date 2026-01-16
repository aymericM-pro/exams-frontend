import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.scss',
})
export class ExamListComponent {
  semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
  selectedSemester = signal('S1');
  private readonly examService = inject(ExamService);
  exams = this.examService.exams;
  filteredExams = computed(() =>
    this.exams().filter((e) => e.semester === this.selectedSemester()),
  );
  loading = this.examService.loading;
  error = this.examService.error;
  private readonly router = inject(Router);

  constructor() {
    this.examService.loadExams();

    effect(() => {
      console.log('📚 Exams:', this.exams());
    });
  }

  selectSemester(s: string): void {
    this.selectedSemester.set(s);
  }

  openExam(id: string): void {
    this.router.navigate(['/exams', id]);
  }

  deleteExam(id: string): void {
    if (confirm('Delete this exam?')) {
      this.examService.deleteExam(id);
    }
  }
}
