import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SortableDirective } from '../../../directives/sortable.directive';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import { ListControlsComponent } from '../../../shared/components/list-controls/list-controls.component';
import { DataTableFooterComponent } from '../../../shared/components/pagination/pagination.component';
import { PageRequest } from '../../../types/page-request.type';
import { Perform } from '../../../types/perform.type';
import { Response } from '../../../types/response.type';
import { Sort, SortField } from '../../../types/sort.type';
import { User } from '../../../types/user.type';
import { DetailsComponent } from './details/details.component';

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
  users = new Perform<Response<User>>();
  pageRequest: PageRequest = { page: 1, size: 10 };
  sort: Sort = { sort_by: SortField.CREATED_AT, descending: true };
  sortableFields = SortField;
  selectAllChecked = false;
  selectedUserIds: number[] = [];
  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  onRefreshButtonClick() {
    this.fetchUsers();
  }

  onSelectAll(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.selectAllChecked = checkbox.checked;
    const selectBoxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('.custom-checkbox');
    selectBoxes.forEach((box) => {
      box.checked = this.selectAllChecked;
    });
  }

  onSelect() {
    const selectBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      '.custom-checkbox:not(#selectAll)'
    );
    const allChecked = Array.from(selectBoxes).every((box) => box.checked);
    this.selectAllChecked = allChecked;

    const selectAllCheckbox = document.querySelector(
      '#selectAll'
    ) as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = this.selectAllChecked;
    }
  }

  getSelectedUserIds(): number[] {
    const selectBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      '.custom-checkbox:not(#selectAll)'
    );
    return Array.from(selectBoxes)
      .filter((box) => box.checked)
      .map((box) => parseInt(box.id));
  }

  min(...values: number[]) {
    return Math.min(...values);
  }

  nextPage() {
    if (this.users.data?.hasNext) {
      this.pageRequest.page++;
      this.fetchUsers();
    }
  }

  previousPage() {
    if (this.users.data?.hasPrevious) {
      this.pageRequest.page--;
      this.fetchUsers();
    }
  }

  onPageChange(change: 'next' | 'previous') {
    if (change === 'next') {
      this.nextPage();
    } else {
      this.previousPage();
    }
  }

  onPageSizeChange(size: number) {
    this.pageRequest.size = size;
    this.validatePageRequest();
    this.fetchUsers();
  }

  onSortChange(sort: Sort) {
    this.sort = sort;
    this.fetchUsers();
  }

  onDeleteSelected() {
    const selectedUsers = this.getSelectedUserIds();
    const title = `Delete ${selectedUsers.length}?`;
    const text =
      'Those users will be deleted forever! Do you want to continue?';
    this.alertService.showConfirmationAlert(title, text, 'warning', () =>
      this.doDeleteSelectedUsers()
    );
  }

  fetchUsers() {
    this.users.load(this.userService.getBy(this.pageRequest, this.sort));
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
    const text = `${this.selectedUserIds.length} users deleted`;
    this.alertService.showSuccessToast(text);
  }

  private showError(errorResponse: HttpErrorResponse) {
    const { error } = errorResponse;
    const errorMessage = error.errorMessage || 'Some server issues occurred';
    this.alertService.showErrorToast(errorMessage);
  }

  private validatePageRequest() {
    if (this.users.data) {
      const itemsLeft =
        this.users.data.totalUsers -
        this.pageRequest.page * this.pageRequest.size;
      if (itemsLeft < 0) {
        this.pageRequest.page = Math.ceil(
          this.users.data.totalUsers / this.pageRequest.size
        );
      }
    }
  }
}
