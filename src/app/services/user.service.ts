import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './models/api-response';
import { IdentityUser } from './models/identity-user.model';

@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';

  // ---- Fetch all identity users (Keycloak users)
  getIdentityUsers() {
    return this.http.get<ApiResponse<IdentityUser[]>>(`${this.baseUrl}/identity-users`);
  }

  // ---- Delete a user
  deleteUser(userId: string) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${userId}`);
  }

  // ---- Delete all users
  deleteAllUsers() {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}`);
  }
}
