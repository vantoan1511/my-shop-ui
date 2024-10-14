import {Component, OnInit} from '@angular/core';
import {DataTableFooterComponent} from "../../../shared/components/pagination/pagination.component";
import {DatePipe} from "@angular/common";
import {ListControlsComponent} from "../../../shared/components/list-controls/list-controls.component";
import {SortableDirective} from "../../../directives/sortable.directive";
import {Perform} from "../../../types/perform.type";
import {Response} from "../../../types/response.type";
import {Model} from "../../../types/product.type";
import {PageRequest} from "../../../types/page-request.type";
import {Sort, SortField} from "../../../types/sort.type";
import {AlertService} from "../../../services/alert.service";
import {HttpErrorResponse} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {ModelService} from "../../../services/model.service";

@Component({
    selector: 'app-models',
    standalone: true,
    imports: [
        DataTableFooterComponent,
        DatePipe,
        ListControlsComponent,
        SortableDirective,
        RouterLink
    ],
    templateUrl: './models.component.html',
    styleUrl: './models.component.scss'
})
export class ModelsComponent implements OnInit {
    models = new Perform<Response<Model>>();
    pageRequest: PageRequest = {page: 1, size: 10};
    sort: Sort = {sortBy: SortField.CREATED_AT, ascending: false};
    sortableFields = SortField;
    selectAllChecked = false;

    constructor(
        private modelService: ModelService,
        private alertService: AlertService
    ) {
    }

    ngOnInit(): void {
        this.fetchModels();
    }

    onRefreshButtonClick() {
        this.fetchModels();
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
        if (this.models.data?.hasNext) {
            this.pageRequest.page++;
            this.fetchModels();
        }
    }

    previousPage() {
        if (this.models.data?.hasPrevious) {
            this.pageRequest.page--;
            this.fetchModels();
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
        this.fetchModels();
    }

    onSortChange(sort: Sort) {
        this.sort = sort;
        this.fetchModels();
    }

    onDeleteSelected() {
        console.log('INFO - Starting deleting models...');
        const selectedUsers = this.getSelectedModelsIds();
        const title = `Delete ${selectedUsers.length} model(s)?`;
        const text =
            'Those models will be deleted forever! Do you want to continue?';
        this.alertService.showConfirmationAlert(title, text, 'warning', () =>
            this.doDeleteSelectedModels()
        );
    }

    private fetchModels() {
        this.models.load(this.modelService.getBy(this.pageRequest, this.sort));
    }

    private doDeleteSelectedModels() {
        this.modelService.delete(this.getSelectedModelsIds()).subscribe({
            next: () => {
                this.showSuccess();
                this.fetchModels();
            },
            error: (error: HttpErrorResponse) => this.showError(error),
        });
    }

    private showSuccess() {
        const text = `${this.getSelectedModelsIds().length} categories deleted`;
        this.alertService.showSuccessToast(text);
    }

    private showError(errorResponse: HttpErrorResponse) {
        const {error} = errorResponse;
        const errorMessage = error.errorMessage || 'Some server issues occurred';
        this.alertService.showErrorToast(errorMessage);
    }

    private getSelectedModelsIds(): number[] {
        const selectBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '.custom-checkbox:not(#selectAll)'
        );
        return Array.from(selectBoxes)
            .filter((box) => box.checked)
            .map((box) => parseInt(box.id));
    }

    private validatePageRequest() {
        if (this.models.data) {
            const itemsLeft =
                this.models.data.totalItems -
                this.pageRequest.page * this.pageRequest.size;
            if (itemsLeft < 0) {
                this.pageRequest.page = Math.ceil(
                    this.models.data.totalItems / this.pageRequest.size
                );
            }
        }
    }
}
