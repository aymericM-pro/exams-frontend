import { inject, Inject, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ExamDto {
  id: string;
  title: string;
  description: string;
}

@Inject({ providedIn: 'root' })
export class ExamApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/exams';

  readonly exams = resource<ExamDto[], void>({
    loader: () => firstValueFrom(this.http.get<ExamDto[]>(this.baseUrl)),
  });
}
