import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SortableDirective } from '../../../directives/sortable.directive';
import { UserService } from '../../../services/user.service';
import { ListControlsComponent } from '../../../shared/components/list-controls/list-controls.component';
import { DataTableFooterComponent } from '../../../shared/components/pagination/pagination.component';
import { PageRequest } from '../../../types/page-request.type';
import { Perform } from '../../../types/perform.type';
import { Response } from '../../../types/response.type';
import { Sort, SortField } from '../../../types/sort.type';
import { User } from '../../../types/user.type';
import { DetailsComponent } from './details/details.component';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.refresh();
  }

  onSelectAll(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.selectAllChecked = checkbox.checked;
    const selectBoxes = document.querySelectorAll(
      '.custom-checkbox'
    ) as NodeListOf<HTMLInputElement>;
    selectBoxes.forEach((box) => {
      box.checked = this.selectAllChecked;
    });
  }

  onSelect() {
    const selectBoxes = document.querySelectorAll(
      '.custom-checkbox:not(#selectAll)'
    ) as NodeListOf<HTMLInputElement>;
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
    const selectBoxes = document.querySelectorAll(
      '.custom-checkbox:not(#selectAll)'
    ) as NodeListOf<HTMLInputElement>;
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
      this.refresh();
    }
  }

  previousPage() {
    if (this.users.data?.hasPrevious) {
      this.pageRequest.page--;
      this.refresh();
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
    this.refresh();
  }

  onSortChange(sort: Sort) {
    this.sort = sort;
    this.refresh();
  }

  onDeleteSelected() {
    console.log('Start deleting', this.getSelectedUserIds());
    this.userService.delete(this.getSelectedUserIds()).subscribe({
      next: () => {
        console.log('Deleted', this.getSelectedUserIds());
        this.showSuccess();
        this.refresh();
      },
      error: (error: HttpErrorResponse) => this.showError(error),
    });
  }

  refresh() {
    this.users.load(this.userService.getBy(this.pageRequest, this.sort));
  }

  private showSuccess() {
    Swal.fire({
      text: `${this.selectedUserIds.length} users deleted`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });
  }
  private showError(error: HttpErrorResponse) {
    Swal.fire({
      text: error.error?.errorMessage,
      icon: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });
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
