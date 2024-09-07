import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { DataTableFooterComponent } from '../../../shared/components/data-table-footer/data-table-footer.component';
import { PageRequest } from '../../../types/page-request.type';
import { Perform } from '../../../types/perform.type';
import { Response } from '../../../types/response.type';
import { User } from '../../../types/user.type';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, DatePipe, DataTableFooterComponent, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users = new Perform<Response<User>>();
  pageRequest: PageRequest = { page: 1, size: 10 };
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users.load(this.userService.getBy(this.pageRequest));
  }

  min(...values: number[]) {
    return Math.min(...values);
  }

  nextPage() {
    if (this.users.data?.hasNext) {
      this.pageRequest.page++;
      this.users.load(this.userService.getBy(this.pageRequest));
    }
  }

  previousPage() {
    if (this.users.data?.hasPrevious) {
      this.pageRequest.page--;
      this.users.load(this.userService.getBy(this.pageRequest));
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
    this.users.load(this.userService.getBy(this.pageRequest));
  }
}
