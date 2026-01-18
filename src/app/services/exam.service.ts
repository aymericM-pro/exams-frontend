import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
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
  readonly examId = signal<string | null>(null);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/exams';

  readonly exams = httpResource<ApiResponse<ExamDto[]>>(() => ({
    url: this.baseUrl,
  }));

  readonly exam = httpResource<ApiResponse<ExamDto>>(() => {
    const id = this.examId();
    return id ? { url: `${this.baseUrl}/${id}` } : undefined;
  });

  deleteExam(id: string) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
