import {AsyncPipe, DatePipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SortableDirective} from '../../../directives/sortable.directive';
import {AlertService} from '../../../services/alert.service';
import {UserService} from '../../../services/user.service';
import {ListControlsComponent} from '../../../shared/components/list-controls/list-controls.component';
import {DataTableFooterComponent} from '../../../shared/components/pagination/pagination.component';
import {PageRequest} from '../../../types/page-request.type';
import {Response} from '../../../types/response.type';
import {Sort, SortField} from '../../../types/sort.type';
import {User} from '../../../types/user.type';
import {DetailsComponent} from './userdetails/userdetails.component';
import {environment} from "../../../../environments/environment";
import {constant} from "../../../shared/constant";

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        AsyncPipe,
        DatePipe,
        DataTableFooterComponent,
        RouterLink,
        SortableDirective,
        DetailsComponent,
        ListControlsComponent,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
    loading = false;
    users: Response<User> | null = null;
    pageRequest: PageRequest = {page: 1, size: 10};
    sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};
    sortableFields = SortField;
    selectAllChecked = false;

    constructor(
        private userService: UserService,
        private alertService: AlertService,
    ) {
    }

    ngOnInit(): void {
        this.fetchUsers();
    }

    fetchUsers() {
        this.loading = true
        this.userService.getBy(this.pageRequest, this.sort).subscribe({
            next: (response) => {
                this.users = response;
                this.loading = false
            },
            error: () => this.loading = false
        });
    }

    protected onRefreshButtonClick() {
        this.fetchUsers();
    }

    protected onSelectAll(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.selectAllChecked = checkbox.checked;
        const selectBoxes: NodeListOf<HTMLInputElement> =
            document.querySelectorAll('.custom-checkbox');
        selectBoxes.forEach((box) => {
            box.checked = this.selectAllChecked;
        });
    }

    protected onSelect() {
        const selectBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '.custom-checkbox:not(#selectAll)'
        );
        this.selectAllChecked = Array.from(selectBoxes).every((box) => box.checked);

        const selectAllCheckbox = document.querySelector(
            '#selectAll'
        ) as HTMLInputElement;
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = this.selectAllChecked;
        }
    }

    protected nextPage() {
        if (this.users?.hasNext) {
            this.pageRequest.page++;
            this.fetchUsers();
        }
    }

    protected previousPage() {
        if (this.users?.hasPrevious) {
            this.pageRequest.page--;
            this.fetchUsers();
        }
    }

    protected onPageChange(change: 'next' | 'previous') {
        if (change === 'next') {
            this.nextPage();
        } else {
            this.previousPage();
        }
    }

    protected onPageSizeChange(size: number) {
        this.pageRequest.size = size;
        this.validatePageRequest();
        this.fetchUsers();
    }

    protected onSortChange(sort: Sort) {
        this.sort = sort;
        this.fetchUsers();
    }

    protected onDeleteSelected() {
        console.log('INFO - Starting deleting user...');
        const selectedUsers = this.getSelectedUserIds();
        const title = `Delete ${selectedUsers.length} user(s)?`;
        const text =
            'Those users will be deleted forever! Do you want to continue?';
        this.alertService.showConfirmationAlert(title, text, 'warning', () =>
            this.doDeleteSelectedUsers()
        );
    }


    protected createUserAvatarUrl(user: User) {
        return `${environment.IMAGE_SERVICE_API}/images/avatar/users/${user.id}`
    }

    protected onAvatarNotFound(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = constant.defaultAvatar;
    }

    private doDeleteSelectedUsers() {
        this.userService.delete(this.getSelectedUserIds()).subscribe({
            next: () => {
                this.showSuccess();
                this.fetchUsers();
            },
            error: (error: HttpErrorResponse) => this.showError(error),
        });
    }

    private showSuccess() {
        const text = `${this.getSelectedUserIds().length} users deleted`;
        this.alertService.showSuccessToast(text);
    }

    private showError(errorResponse: HttpErrorResponse) {
        const {error} = errorResponse;
        const errorMessage = error.errorMessage || 'Some server issues occurred';
        this.alertService.showErrorToast(errorMessage);
    }

    private getSelectedUserIds(): number[] {
        const selectBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '.custom-checkbox:not(#selectAll)'
        );
        return Array.from(selectBoxes)
            .filter((box) => box.checked)
            .map((box) => parseInt(box.id));
    }

    private validatePageRequest() {
        if (this.users) {
            const itemsLeft =
                this.users.totalItems -
                this.pageRequest.page * this.pageRequest.size;
            if (itemsLeft < 0) {
                this.pageRequest.page = Math.ceil(
                    this.users.totalItems / this.pageRequest.size
                );
            }
        }
    }

    protected readonly constant = constant;
}
