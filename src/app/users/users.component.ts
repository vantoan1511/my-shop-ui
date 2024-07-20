import {Component, OnInit} from '@angular/core';
import {User} from "./user";
import {UserService} from "./user.service";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {EditableDirective} from "../editable.directive";
import {SorterComponent} from "../sorter/sorter.component";

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        FaIconComponent,
        CdkTextareaAutosize,
        EditableDirective,
        SorterComponent,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

    users: User[] = [];

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.getAll();
    }

    getAll() {
        this.userService.fetchAll().subscribe((users) => {
            this.users = users;
        });
    }

    protected readonly faSearch = faMagnifyingGlass;
}
