import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../../apis/user.service";
import {faAngleDown, faAngleLeft, faAngleRight, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {EditableDirective} from "../../../../shared/directives/editable.directive";
import {SorterComponent} from "../../../../shared/component/sorter/sorter.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {BehaviorSubject, Observable, shareReplay, switchMap} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {PageRequest} from "../../../../types/page-request";
import {SpinnerComponent} from "../../../../shared/component/spinner/spinner.component";
import {switchMapWithLoading} from "../../../../switch-map-with-loading";
import {LoadingState} from "../../../../types/loading-state";
import {RandomColSizePipe} from "../../../../shared/pipes/RandomColSize.pipe";
import {HighlightDirective} from "../../../../shared/directives/highlight.directive";
import {SortableDirective} from "../../../../shared/directives/sortable.directive";
import {Sort} from "../../../../types/sort";
import {UserResponse} from "../../../../types/user-response";
import {Perform} from "../../../../types/perform";

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
        HighlightDirective,
        SortableDirective,
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
    keyword = new FormControl('');
    users$!: Observable<LoadingState<UserResponse>>;
    data = new Perform<UserResponse>()
    pageRequest$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>({
        page: 1,
        size: 10
    });

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.data.load(this.pageRequest$.pipe(
            switchMap((pageRequest: PageRequest) => this.userService.fetchBy(pageRequest)),
            shareReplay(1)
        ));
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

    onSort(sort: Sort) {
        console.log(sort);
    }

    protected readonly faSearch = faMagnifyingGlass;
    protected readonly faNext = faAngleRight;
    protected readonly faPrev = faAngleLeft;
    protected readonly faAngleDown = faAngleDown;
}
