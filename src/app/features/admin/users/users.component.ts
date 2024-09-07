import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SortableDirective } from '../../../directives/sortable.directive';
import { UserService } from '../../../services/user.service';
import { DataTableFooterComponent } from '../../../shared/components/data-table-footer/data-table-footer.component';
import { PageRequest } from '../../../types/page-request.type';
import { Perform } from '../../../types/perform.type';
import { Response } from '../../../types/response.type';
import { Sort, SortField } from '../../../types/sort.type';
import { User } from '../../../types/user.type';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    DataTableFooterComponent,
    RouterLink,
    SortableDirective,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users = new Perform<Response<User>>();
  pageRequest: PageRequest = { page: 1, size: 10 };
  sort: Sort = { sort_by: SortField.CREATED_AT, descending: true };
  sortableFields = SortField;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users.load(this.userService.getBy(this.pageRequest, this.sort));
  }

  min(...values: number[]) {
    return Math.min(...values);
  }

  nextPage() {
    if (this.users.data?.hasNext) {
      this.pageRequest.page++;
      this.users.load(this.userService.getBy(this.pageRequest, this.sort));
    }
  }

  previousPage() {
    if (this.users.data?.hasPrevious) {
      this.pageRequest.page--;
      this.users.load(this.userService.getBy(this.pageRequest, this.sort));
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
    this.users.load(this.userService.getBy(this.pageRequest, this.sort));
  }

  onSortChange(sort: Sort) {
    this.sort = sort;
    this.users.load(this.userService.getBy(this.pageRequest, this.sort));
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
