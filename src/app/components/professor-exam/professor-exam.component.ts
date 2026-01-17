import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ExamService } from '../../services/exam.service';

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
  private readonly router = inject(Router);

  constructor() {
    this.examService.loadExams();

    effect(() => {
      console.log('👨‍🏫 Exams:', this.exams());
    });
  }

  openExam(id: string): void {
    this.router.navigate(['/exams', id], {
      queryParams: { mode: 'view' },
    });
  }

  editExam(id: string): void {
    this.router.navigate(['/exams/builder'], {
      queryParams: { edit: id },
    });
  }

  deleteExam(id: string): void {
    if (confirm('Delete this exam?')) {
      this.examService.deleteExam(id);
    }
  }
}
