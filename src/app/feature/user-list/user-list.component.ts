import {Component, OnInit} from '@angular/core';
import {User} from "../../shared/model/user";
import {UserService} from "../../core/user.service";
import {faAngleDown, faAngleLeft, faAngleRight, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {EditableDirective} from "../../shared/directive/editable.directive";
import {SorterComponent} from "../../shared/component/sorter/sorter.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {BehaviorSubject, Observable, shareReplay, take, takeUntil} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {PageResponse} from "../../shared/model/page-response";
import {PageRequest} from "../../shared/model/page-request";
import {SpinnerComponent} from "../../shared/component/spinner/spinner.component";
import {switchMapWithLoading} from "../../switch-map-with-loading";
import {LoadingState} from "../../shared/model/loading-state";
import {RandomColSizePipe} from "../../shared/pipe/RandomColSize.pipe";

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
        NgIf,
        RandomColSizePipe,
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
    keyword = new FormControl('');
    protected users$!: Observable<LoadingState<PageResponse<User>>>;
    protected pageRequest$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>({
        page: 1,
        size: 10
    });

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.users$ =
            this.pageRequest$.pipe(
                switchMapWithLoading((pageRequest) => this.userService.fetchBy(pageRequest)),
                shareReplay(1)
            )
    }

    onToPrevPage() {
        const prevPage = this.pageRequest$.value.page - 1;
        if (prevPage >= 1) {
            this.pageRequest$.next({...this.pageRequest$.value, page: prevPage});
        }
    }

    onToNextPage() {
        const nextPage = this.pageRequest$.value.page + 1;
        this.pageRequest$.next({...this.pageRequest$.value, page: nextPage});
    }

    protected readonly faSearch = faMagnifyingGlass;
    protected readonly faNext = faAngleRight;
    protected readonly faPrev = faAngleLeft;
    protected readonly faAngleDown = faAngleDown;
}
