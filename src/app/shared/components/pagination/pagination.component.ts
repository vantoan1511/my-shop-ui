import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PageRequest} from '../../../types/page-request.type';
import {PagedResponse} from '../../../types/response.type';
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class DataTableFooterComponent<T> {
  @Input() loading = false;
  @Input() pageRequest!: PageRequest;
  @Input() items: PagedResponse<T> | null = null;
  @Output() pageChange = new EventEmitter<'next' | 'previous'>();
  @Output() pageSizeChange = new EventEmitter<number>();

  constructor(
    private translateService: TranslateService,
  ) {
    this.translateService.setDefaultLang("vi")
  }

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
