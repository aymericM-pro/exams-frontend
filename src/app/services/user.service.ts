import { inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { ApiResponse } from './models/api-response';
import { IdentityUser } from './models/identity-user.model';

@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';

  readonly identityUsers = httpResource<ApiResponse<IdentityUser[]>>(() => ({
    url: `${this.baseUrl}/identity-users`,
  }));

  deleteUser(userId: string) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${userId}`);
  }

  deleteAllUsers() {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}`);
  }
}
