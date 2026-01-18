import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateClassRequest } from './models/create-class.model';
import { ClassResponse } from './models/class-response.model';
import { StudentResponse } from './models/student-responses.model';
import { ApiResponse } from './models/api-response';

@Injectable({ providedIn: 'root' })
export class ClassApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/classes';

  create(request: CreateClassRequest) {
    return this.http.post<ApiResponse<ClassResponse>>(this.baseUrl, request);
  }

  getAll() {
    return this.http.get<ApiResponse<ClassResponse[]>>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<ApiResponse<ClassResponse>>(`${this.baseUrl}/${id}`);
  }

  delete(id: string) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  getStudents(classId: string) {
    return this.http.get<ApiResponse<StudentResponse[]>>(`${this.baseUrl}/${classId}/students`);
  }

  exportStudentsPdf(classId: string) {
    return this.http.get(`${this.baseUrl}/${classId}/students/pdf`, { responseType: 'blob' });
  }
}
