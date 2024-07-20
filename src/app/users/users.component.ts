import {Component, OnInit} from '@angular/core';
import {User} from "./user";
import {UserService} from "./user.service";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {EditableDirective} from "../editable.directive";
import {SorterComponent} from "../sorter/sorter.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, of, switchMap} from "rxjs";

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        FaIconComponent,
        CdkTextareaAutosize,
        EditableDirective,
        SorterComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

    keyword = new FormControl('');

    users: User[] = [];

    filteredUsers: User[] = [];

    isFetching: boolean = false;

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.getAll();

        this.keyword.valueChanges.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            switchMap((term) => {
                return this.filterItem(term);
            })
        ).subscribe(filteredUsers => {
            this.filteredUsers = filteredUsers;
        });
    }

    getAll() {
        this.userService.fetchAll().subscribe((users) => {
            this.users = users;
            this.filteredUsers = users;
        });
    }

    filterItem(term: string | null) {
        if (!term) {
            return of(this.users)
        }
        const filteredUsers = this.users.filter(user =>
            user.firstName?.toLowerCase().includes(term.toLowerCase())
        );
        return of(filteredUsers);
    }

    protected readonly faSearch = faMagnifyingGlass;
}
