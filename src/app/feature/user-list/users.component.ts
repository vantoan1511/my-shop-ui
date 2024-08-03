import {Component, OnInit} from '@angular/core';
import {User} from "../../shared/model/user";
import {UserService} from "../../core/user.service";
import {faAngleDown, faAngleLeft, faAngleRight, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {EditableDirective} from "../../shared/directive/editable.directive";
import {SorterComponent} from "../../shared/component/sorter/sorter.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {BehaviorSubject, Observable, switchMap, tap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {PageResponse} from "../../shared/model/page-response";
import {PageRequest} from "../../shared/model/page-request";
import {SpinnerComponent} from "../../shared/component/spinner/spinner.component";

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        FaIconComponent,
        EditableDirective,
        SorterComponent,
        AsyncPipe,
        ReactiveFormsModule,
        SpinnerComponent,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
    keyword = new FormControl('');
    isFetching: boolean = false;
    protected users$?: Observable<PageResponse<User>>;
    protected pageRequest$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>({
        pageNumber: 1,
        pageSize: 10
    });

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.users$ = this.pageRequest$.pipe(
            tap(() => this.isFetching = true),
            switchMap(pageRequest => this.userService.fetchBy(pageRequest)),
            tap(() => this.isFetching = false)
        );
    }


    onToPrevPage() {
        const prevPage = this.pageRequest$.value.pageNumber - 1;
        if (prevPage >= 1) {
            this.pageRequest$.next({...this.pageRequest$.value, pageNumber: prevPage});
        }
    }

    onToNextPage() {
        const nextPage = this.pageRequest$.value.pageNumber + 1;
        this.pageRequest$.next({...this.pageRequest$.value, pageNumber: nextPage});
    }

    protected readonly faSearch = faMagnifyingGlass;
    protected readonly faNext = faAngleRight;
    protected readonly faPrev = faAngleLeft;
    protected readonly faAngleDown = faAngleDown;
}
