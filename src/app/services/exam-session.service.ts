import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateExamSessionRequest } from './models/create-exam-session.model';
import { ExamSessionDto } from './models/exam-session.model';
import { ApiResponse } from './models/api-response';

@Injectable({ providedIn: 'root' })
export class ExamSessionService {
  readonly sessions = signal<ExamSessionDto[]>([]);
  readonly session = signal<ExamSessionDto | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/exam-sessions';

  createSession(request: CreateExamSessionRequest): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.post<ApiResponse<ExamSessionDto>>(this.baseUrl, request).subscribe({
      next: (res) => {
        if (res.success) {
          this.session.set(res.data);
          this.sessions.update((s) => [...s, res.data]);
        } else {
          this.error.set('Failed to create exam session');
        }
      },
      error: () => this.error.set('Failed to create exam session'),
      complete: () => this.loading.set(false),
    });
  }

  loadSessions(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<ExamSessionDto[]>>(this.baseUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.sessions.set(res.data ?? []);
        } else {
          this.error.set('Failed to load exam sessions');
        }
      },
      error: () => this.error.set('Failed to load exam sessions'),
      complete: () => this.loading.set(false),
    });
  }

  loadSessionById(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<ExamSessionDto>>(`${this.baseUrl}/${id}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.session.set(res.data);
        } else {
          this.error.set('Failed to load exam session');
        }
      },
      error: () => this.error.set('Failed to load exam session'),
      complete: () => this.loading.set(false),
    });
  }
}
