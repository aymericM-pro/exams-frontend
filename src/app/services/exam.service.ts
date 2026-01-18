import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './models/api-response';

export interface AnswerDto {
  answerId: string | null;
  text: string;
  correct: boolean;
  position: number;
}

export interface QuestionDto {
  questionId: string | null;
  title: string;
  type: string;
  position: number;
  answers: AnswerDto[];
}

export interface ExamDto {
  examId: string;
  title: string;
  description: string;
  semester: string;
  createdAt: string;
  questions: QuestionDto[];
}

@Injectable({ providedIn: 'root' })
export class ExamService {
  readonly exams = signal<ExamDto[]>([]);
  readonly exam = signal<ExamDto | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/exams';

  loadExams(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<ExamDto[]>>(this.baseUrl).subscribe({
      next: (res) => this.exams.set(res.data),
      error: () => this.error.set('Failed to load exams'),
      complete: () => this.loading.set(false),
    });
  }

  loadExamById(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<ExamDto>>(`${this.baseUrl}/${id}`).subscribe({
      next: (res) => this.exam.set(res.data),
      error: () => this.error.set('Failed to load exam'),
      complete: () => this.loading.set(false),
    });
  }

  deleteExam(id: string): void {
    this.exams.update((exams) => exams.filter((e) => e.examId !== id));
  }
}
