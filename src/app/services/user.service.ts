import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {PageRequest} from '../types/page-request.type';
import {PasswordReset} from '../types/password-reset.type';
import {PagedResponse} from '../types/response.type';
import {Sort} from '../types/sort.type';
import {UserCreation} from '../types/user-creation.type';
import {CustomerProfileUpdate, UserUpdate} from '../types/user-update.type';
import {User, UserRegister} from '../types/user.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected BASE_URL = environment.USER_SERVICE_API;
  protected USER_SERVICE_API_URL = `${this.BASE_URL}/users`;
  protected CUSTOMER_SERVICE_API_URL = `${this.BASE_URL}/customers`;

  constructor(private http: HttpClient) {
  }

  getAllRoles() {
    return this.http.get<string[]>(`${this.USER_SERVICE_API_URL}/roles`);
  }

  getUserRoles(userId: number) {
    return this.http.get<string[]>(`${this.USER_SERVICE_API_URL}/${userId}/roles`);
  }

  assignRoleGroup(userId: number, roleGroup: string) {
    return this.http.patch(`${this.USER_SERVICE_API_URL}/${userId}/roles/${roleGroup}`, {});
  }

  removeRoleGroup(userId: number, roleGroup: string) {
    return this.http.delete(`${this.USER_SERVICE_API_URL}/${userId}/roles/${roleGroup}`);
  }

  getByCriteria( pageRequest?: PageRequest, sort?: Sort,) {
    return this.http.get<PagedResponse<User>>(this.USER_SERVICE_API_URL, {
      params: {
        ...pageRequest,
        ...sort,
      },
    });
  }

  getById(id: number) {
    return this.http.get<User>(`${this.USER_SERVICE_API_URL}/${id}`);
  }

  getByUsername(username: string) {
    return this.http.get<User>(`${this.CUSTOMER_SERVICE_API_URL}/${username}`);
  }

  create(userCreation: UserCreation) {
    return this.http.post<User>(this.USER_SERVICE_API_URL, userCreation);
  }

  update(userUpdate: UserUpdate) {
    return this.http.put(
      `${this.USER_SERVICE_API_URL}/${userUpdate.id}`,
      userUpdate
    );
  }

  updateProfile(username: string, profile: CustomerProfileUpdate) {
    return this.http.put(
      `${this.CUSTOMER_SERVICE_API_URL}/${username}`,
      profile
    );
  }

  changePassword(username: string, newPassword: string) {
    return this.http.put(
      `${this.CUSTOMER_SERVICE_API_URL}/${username}/change-password`,
      {
        newPassword,
      }
    );
  }

  resetPassword(userId: number, passwordReset: PasswordReset) {
    return this.http.put(
      `${this.USER_SERVICE_API_URL}/${userId}/reset-password`,
      passwordReset
    );
  }

  delete(ids: number[]) {
    return this.http.delete(this.USER_SERVICE_API_URL, {
      body: ids,
    });
  }

  register(register: UserRegister) {
    return this.http.post(`${this.CUSTOMER_SERVICE_API_URL}`, register);
  }

  forgot(email: string) {
    return this.http.post(`${this.CUSTOMER_SERVICE_API_URL}/forgot`, {
      email,
    });
  }
}
