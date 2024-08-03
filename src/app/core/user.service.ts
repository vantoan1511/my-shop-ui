import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../shared/model/user";
import {delay, map, tap} from "rxjs";
import {PageRequest} from "../shared/model/page-request";
import {PageResponse} from "../shared/model/page-response";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(protected readonly http: HttpClient) {
    }

    public fetchBy(pageRequest: PageRequest) {
        return this.prepareMockData(pageRequest);
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
                tap((resp) => console.log(resp))
            );
    }
}
