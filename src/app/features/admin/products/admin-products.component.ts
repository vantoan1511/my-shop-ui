import {Component, OnInit} from '@angular/core';
import {DataTableFooterComponent} from "../../../shared/components/pagination/pagination.component";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {ListControlsComponent} from "../../../shared/components/list-controls/list-controls.component";
import {SortableDirective} from "../../../directives/sortable.directive";
import {PageRequest} from "../../../types/page-request.type";
import {Product} from "../../../types/product.type";
import {Response} from "../../../types/response.type";
import {Perform} from "../../../types/perform.type";
import {Sort, SortField} from "../../../types/sort.type";
import {RouterLink} from "@angular/router";
import {ProductService} from "../../../services/product.service";
import {AlertService} from "../../../services/alert.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'admin-products',
    standalone: true,
    imports: [
        DataTableFooterComponent,
        DatePipe,
        ListControlsComponent,
        SortableDirective,
        RouterLink,
        CurrencyPipe
    ],
    templateUrl: './admin-products.component.html',
    styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {
    pageRequest: PageRequest = {page: 1, size: 10};
    sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};
    products = new Perform<Response<Product>>()
    sortableFields = SortField;
    selectAllChecked = false;

    constructor(
        private productService: ProductService,
        private alertService: AlertService
    ) {
    }

    ngOnInit(): void {
        this.fetchProducts();
    }

    onRefreshButtonClick() {
        this.fetchProducts();
    }

    onDeleteSelected() {
        console.log('INFO - Starting deleting product...');
        const selectedUsers = this.getSelectedProductIds();
        const title = `Delete ${selectedUsers.length} product(s)?`;
        const text =
            'Those products will be deleted forever! Do you want to continue?';
        this.alertService.showConfirmationAlert(title, text, 'warning', () =>
            this.doDeleteSelectedProducts()
        );
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
        this.fetchProducts();
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

    onSortChange(sort: Sort) {
        this.sort = sort;
        this.fetchProducts();
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

    private fetchProducts() {
        this.products.load(this.productService.getBy(this.pageRequest, this.sort));
    }

    private nextPage() {
        if (this.products.data?.hasNext) {
            this.pageRequest.page++;
            this.fetchProducts();
        }
    }

    private previousPage() {
        if (this.products.data?.hasPrevious) {
            this.pageRequest.page--;
            this.fetchProducts();
        }
    }

    private validatePageRequest() {
        if (this.products.data) {
            const itemsLeft =
                this.products.data.totalItems -
                this.pageRequest.page * this.pageRequest.size;
            if (itemsLeft < 0) {
                this.pageRequest.page = Math.ceil(
                    this.products.data.totalItems / this.pageRequest.size
                );
            }
        }
    }

    private getSelectedProductIds(): number[] {
        const selectBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '.custom-checkbox:not(#selectAll)'
        );
        return Array.from(selectBoxes)
            .filter((box) => box.checked)
            .map((box) => parseInt(box.id));
    }

    private doDeleteSelectedProducts() {
        this.productService.delete(this.getSelectedProductIds()).subscribe({
            next: () => {
                this.showSuccess();
                this.fetchProducts();
            },
            error: (error: HttpErrorResponse) => this.showError(error),
        });
    }

    private showSuccess() {
        const text = `${this.getSelectedProductIds().length} products deleted`;
        this.alertService.showSuccessToast(text);
    }

    private showError(errorResponse: HttpErrorResponse) {
        const {error} = errorResponse;
        const errorMessage = error.errorMessage || 'Some server issues occurred';
        this.alertService.showErrorToast(errorMessage);
    }
}
