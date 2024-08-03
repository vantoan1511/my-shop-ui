import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../shared/model/user";
import {delay, map, startWith} from "rxjs";
import {PageRequest} from "../shared/model/page-request";
import {PageResponse} from "../shared/model/page-response";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(protected readonly http: HttpClient) {
    }

    public fetchAll() {
        return this.http.get<User[]>('assets/json/users.json')
            .pipe(
                delay(1000),
                map((users) => ({
                    totalOfItems: users.length,
                    numberOfItems: users.length,
                    page: 1,
                    size: users.length,
                    hasNext: false,
                    hasPrev: false,
                    items: users
                } as PageResponse<User>))
            );
    }

    public fetchBy(pageRequest: PageRequest) {
        return this.fetchAll()
            .pipe(
                map(resp => {
                    const start = (pageRequest.pageNumber - 1) * pageRequest.pageSize;
                    const end = start + pageRequest.pageSize;
                    const items = resp.items.slice(start, end);
                    const hasNext = pageRequest.pageNumber * pageRequest.pageSize < resp.totalOfItems;
                    const hasPrev = pageRequest.pageNumber > 1;

                    return {
                        ...resp,
                        numberOfItems: items.length,
                        page: pageRequest.pageNumber,
                        size: pageRequest.pageSize,
                        hasNext: hasNext,
                        hasPrev: hasPrev,
                        items: items,
                    }
                }),
            );
    }
}
