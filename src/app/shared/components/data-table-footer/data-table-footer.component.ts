import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageRequest } from '../../../types/page-request.type';
import { Perform } from '../../../types/perform.type';
import { Response } from '../../../types/response.type';
import { User } from '../../../types/user.type';

@Component({
  selector: 'app-data-table-footer',
  standalone: true,
  imports: [],
  templateUrl: './data-table-footer.component.html',
  styleUrl: './data-table-footer.component.scss',
})
export class DataTableFooterComponent {
  @Input() pageRequest!: PageRequest;
  @Input() users!: Perform<Response<User>>;
  @Output() pageChange = new EventEmitter<'next' | 'previous'>();
  @Output() pageSizeChange = new EventEmitter<number>();

  min(...values: number[]) {
    return Math.min(...values);
  }

  changePageSize(size: number) {
    this.pageSizeChange.emit(size);
  }

  previousPage() {
    this.pageChange.emit('previous');
  }

  nextPage() {
    this.pageChange.emit('next');
  }
}
