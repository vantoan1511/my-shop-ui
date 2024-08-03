import {Component, OnInit} from '@angular/core';
import {User} from "../../shared/model/user";
import {UserService} from "../../core/user.service";
import {faMagnifyingGlass, faAngleLeft, faAngleRight, faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {EditableDirective} from "../../shared/directive/editable.directive";
import {SorterComponent} from "../../shared/component/sorter/sorter.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Observable, tap} from "rxjs";
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

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.fetchUsers({pageNumber: 1, pageSize: 10})
    }

    private fetchUsers(pageRequest: PageRequest) {
        this.isFetching = true;
        this.users$ = this.userService.fetchBy(pageRequest)
            .pipe(tap(() => this.isFetching = false));
    }

    protected readonly faSearch = faMagnifyingGlass;
    protected readonly faNext = faAngleRight;
    protected readonly faPrev = faAngleLeft;
    protected readonly faAngleDown = faAngleDown;
}
