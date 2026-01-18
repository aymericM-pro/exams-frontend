import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';

import { CreateClassRequest } from './models/create-class.model';
import { ClassResponse } from './models/class-response.model';
import { StudentResponse } from './models/student-responses.model';
import { ApiResponse } from './models/api-response';

@Injectable({ providedIn: 'root' })
export class ClassApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/classes';
  readonly allClasses = httpResource<ApiResponse<ClassResponse[]>>(() => ({
    url: this.baseUrl,
  }));
  readonly myClasses = httpResource<ApiResponse<ClassResponse[]>>(() => ({
    url: `${this.baseUrl}/me`,
  }));
  private readonly classId = signal<string | null>(null);

  readonly classById = httpResource<ApiResponse<ClassResponse>>(() => {
    const id = this.classId();
    return id ? { url: `${this.baseUrl}/${id}` } : undefined;
  });
  readonly studentsByClass = httpResource<ApiResponse<StudentResponse[]>>(() => {
    const id = this.classId();
    console.log('je suis là');
    return { url: `${this.baseUrl}/a2b39e6c-f116-45c0-8af9-604f342d80a2/students` };
  });

  setClassId(id: string): void {
    this.classId.set(id);
  }

  create(request: CreateClassRequest) {
    return this.http.post<ApiResponse<ClassResponse>>(this.baseUrl, request);
  }

  delete(id: string) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  exportStudentsPdf(classId: string) {
    return this.http.get(`${this.baseUrl}/${classId}/students/pdf`, { responseType: 'blob' });
  }
}
