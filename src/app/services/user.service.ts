import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageRequest } from '../types/page-request.type';
import { PasswordReset } from '../types/password-reset.type';
import { Response } from '../types/response.type';
import { Sort } from '../types/sort.type';
import { UserCreation } from '../types/user-creation.type';
import { CustomerProfileUpdate, UserUpdate } from '../types/user-update.type';
import { User } from '../types/user.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getBy(pageRequest?: PageRequest, sort?: Sort) {
    return this.http.get<Response<User>>('http://localhost:8081/api/users', {
      params: {
        ...pageRequest,
        ...sort,
      },
    });
  }

  getById(id: number) {
    return this.http.get<User>(`http://localhost:8081/api/users/${id}`);
  }

  getByUsername(username: string) {
    return this.http.get<User>(
      `http://localhost:8081/api/customers/${username}`
    );
  }

  create(userCreation: UserCreation) {
    return this.http.post<User>(
      'http://localhost:8081/api/users',
      userCreation
    );
  }

  update(userUpdate: UserUpdate) {
    return this.http.put(
      'http://localhost:8081/api/users/' + userUpdate.id,
      userUpdate
    );
  }

  updateProfile(username: string, profile: CustomerProfileUpdate) {
    return this.http.put(
      `http://localhost:8081/api/customers/${username}`,
      profile
    );
  }

  changePassword(username: string, newPassword: string) {
    return this.http.put(
      `http://localhost:8081/api/customers/${username}/change-password`,
      {
        newPassword,
      }
    );
  }

  resetPassword(userId: number, passwordReset: PasswordReset) {
    return this.http.put(
      'http://localhost:8081/api/users/' + userId + '/reset-password',
      passwordReset
    );
  }

  delete(ids: number[]) {
    return this.http.delete('http://localhost:8081/api/users', {
      body: ids,
    });
  }
}
