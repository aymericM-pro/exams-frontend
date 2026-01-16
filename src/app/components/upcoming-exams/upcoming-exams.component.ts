import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { DatePipe } from '@angular/common';

export interface UpcomingExam {
  sessionId: string;
  examId: string;
  title: string;
  semester: string;
  startAt: string;
  durationMinutes: number;
}

@Component({
  selector: 'app-upcoming-exams',
  templateUrl: './upcoming-exams.component.html',
  styleUrls: ['./upcoming-exams.component.scss'],
  standalone: true,
  imports: [DatePipe],
})
export class UpcomingExamsComponent {
  private readonly examService = inject(ExamService);
  readonly exams = this.examService.exams;
  readonly loading = this.examService.loading;
  readonly error = this.examService.error;
  private readonly router = inject(Router);

  constructor() {
    this.examService.loadExams();

    console.log('je suis la ');
    effect(() => {
      console.log('📚 Exams:', this.exams());
    });
  }

  openExam(examId: string): void {
    // void this.router.navigate(['/exams', examId]);
  }

  startExam(examId: string): void {
    console.log('Start exam', examId);
  }
}
