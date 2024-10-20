import {Component, OnInit} from '@angular/core';
import {DataTableFooterComponent} from "../../../shared/components/pagination/pagination.component";
import {DatePipe} from "@angular/common";
import {ListControlsComponent} from "../../../shared/components/list-controls/list-controls.component";
import {SortableDirective} from "../../../directives/sortable.directive";
import {Response} from "../../../types/response.type";
import {Category} from "../../../types/product.type";
import {PageRequest} from "../../../types/page-request.type";
import {Sort, SortField} from "../../../types/sort.type";
import {AlertService} from "../../../services/alert.service";
import {HttpErrorResponse} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {CategoryService} from "../../../services/category.service";

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [
        DataTableFooterComponent,
        DatePipe,
        ListControlsComponent,
        SortableDirective,
        RouterLink
    ],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
    loading = false
    categories: Response<Category> | null = null;
    pageRequest: PageRequest = {page: 1, size: 10};
    sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};
    sortableFields = SortField;
    selectAllChecked = false;

    constructor(
        private categoryService: CategoryService,
        private alertService: AlertService
    ) {
    }

    ngOnInit(): void {
        this.fetchCategories();
    }

    onRefreshButtonClick() {
        this.fetchCategories();
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

    nextPage() {
        if (this.categories?.hasNext) {
            this.pageRequest.page++;
            this.fetchCategories();
        }
    }

    previousPage() {
        if (this.categories?.hasPrevious) {
            this.pageRequest.page--;
            this.fetchCategories();
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
        this.fetchCategories();
    }

    onSortChange(sort: Sort) {
        this.sort = sort;
        this.fetchCategories();
    }

    onDeleteSelected() {
        console.log('INFO - Starting deleting categories...');
        const selectedUsers = this.getSelectedCategoriesIds();
        const title = `Delete ${selectedUsers.length} category(s)?`;
        const text =
            'Those categories will be deleted forever! Do you want to continue?';
        this.alertService.showConfirmationAlert(title, text, 'warning', () =>
            this.doDeleteSelectedCategories()
        );
    }

    private fetchCategories() {
        this.loading = true
        this.categoryService.getBy(this.pageRequest, this.sort).subscribe({
            next: (categories) => {
                this.categories = categories
                this.loading = false
            },
            error: () => this.loading = false
        })
    }

    private doDeleteSelectedCategories() {
        this.categoryService.delete(this.getSelectedCategoriesIds()).subscribe({
            next: () => {
                this.showSuccess();
                this.fetchCategories();
            },
            error: (error: HttpErrorResponse) => this.showError(error),
        });
    }

    private showSuccess() {
        const text = `${this.getSelectedCategoriesIds().length} categories deleted`;
        this.alertService.showSuccessToast(text);
    }

    private showError(errorResponse: HttpErrorResponse) {
        const {error} = errorResponse;
        const errorMessage = error.errorMessage || 'Some server issues occurred';
        this.alertService.showErrorToast(errorMessage);
    }

    private getSelectedCategoriesIds(): number[] {
        const selectBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '.custom-checkbox:not(#selectAll)'
        );
        return Array.from(selectBoxes)
            .filter((box) => box.checked)
            .map((box) => parseInt(box.id));
    }

    private validatePageRequest() {
        if (this.categories) {
            const itemsLeft =
                this.categories.totalItems -
                this.pageRequest.page * this.pageRequest.size;
            if (itemsLeft < 0) {
                this.pageRequest.page = Math.ceil(
                    this.categories.totalItems / this.pageRequest.size
                );
            }
        }
    }
}
