import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../types/user";
import {delay, map} from "rxjs";
import {PageRequest} from "../types/page-request";
import {PageResponse} from "../types/page-response";
import {UserResponse} from "../types/user-response";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(protected readonly http: HttpClient) {
    }

    public fetchBy(pageRequest: PageRequest) {
        return this.http.get<UserResponse>('http://localhost:8081/api/users', {
            params: {...pageRequest}
        })
    }

    private prepareMockData(pageRequest: PageRequest) {
        return this.http.get<User[]>('assets/json/users.json')
            .pipe(
                delay(1000),
                map((users) => {
                    const totalPages = Math.round(users.length / pageRequest.size);
                    const hasPrev = pageRequest.page > 1;
                    const hasNext = pageRequest.page < totalPages;
                    const start = (pageRequest.page - 1) * pageRequest.page;
                    const end = start + pageRequest.size;
                    const items = users.slice(start, end);

                    return {
                        ...pageRequest,
                        totalOfItems: users.length,
                        numberOfItems: items.length,
                        hasPrev,
                        hasNext,
                        items,
                    } as PageResponse<User>;
                }),
            );
    }
}
