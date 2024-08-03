import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../shared/model/user";
import {delay} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(protected readonly http: HttpClient) {
    }

    public fetchAll() {
        return this.http.get<User[]>('assets/json/users.json').pipe(delay(1000));
    }
}
