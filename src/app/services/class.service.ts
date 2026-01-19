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

  // READ RESOURCES
  readonly studentsByClass = httpResource<ApiResponse<StudentResponse[]>>(() => {
    const id = this.classId();
    return id ? { url: `${this.baseUrl}/${id}/students` } : undefined;
  });
  private readonly studentToRemove = signal<string | null>(null);
  readonly removeStudentResource = httpResource<void>(() => {
    const classId = this.classId();
    const studentId = this.studentToRemove();

    if (!classId || !studentId) return undefined;

    return {
      url: `${this.baseUrl}/${classId}/students/${studentId}`,
      method: 'DELETE',
    };
  });
  private readonly classPayload = signal<CreateClassRequest | null>(null);

  private readonly classToUpdate = signal<string | null>(null);
  readonly saveClassResource = httpResource<ApiResponse<ClassResponse>>(() => {
    const payload = this.classPayload();
    if (!payload) return undefined;

    const id = this.classToUpdate();

    return id
      ? {
          url: `${this.baseUrl}/${id}`,
          method: 'PUT',
          body: payload,
        }
      : {
          url: this.baseUrl,
          method: 'POST',
          body: payload,
        };
  });

  setClassId(id: string): void {
    this.classId.set(id);
  }

  removeStudentFromClass(studentId: string): void {
    this.studentToRemove.set(studentId);
  }

  create(payload: CreateClassRequest): void {
    this.classPayload.set(payload);
    this.classToUpdate.set(null);
  }

  update(id: string, payload: CreateClassRequest): void {
    this.classPayload.set(payload);
    this.classToUpdate.set(id);
  }

  exportStudentsPdf(classId: string) {
    return this.http.get(`${this.baseUrl}/${classId}/students/pdf`, { responseType: 'blob' });
  }
}
