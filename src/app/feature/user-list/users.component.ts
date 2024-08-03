import {Component, OnInit} from '@angular/core';
import {User} from "../../shared/model/user";
import {UserService} from "../../core/user.service";
import {faAngleDown, faAngleLeft, faAngleRight, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {EditableDirective} from "../../shared/directive/editable.directive";
import {SorterComponent} from "../../shared/component/sorter/sorter.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {BehaviorSubject, Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {PageResponse} from "../../shared/model/page-response";
import {PageRequest} from "../../shared/model/page-request";
import {SpinnerComponent} from "../../shared/component/spinner/spinner.component";
import {switchMapWithLoading} from "../../core/switch-map-with-loading";
import {LoadingState} from "../../shared/model/loading-state";

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
    protected users$!: Observable<LoadingState<PageResponse<User>>>;
    protected pageRequest$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>({
        pageNumber: 1,
        pageSize: 10
    });

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.users$ =
            this.pageRequest$.pipe(
                switchMapWithLoading((pageRequest) => this.userService.fetchBy(pageRequest)),
            )
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
