import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Category} from "../../../../types/product.type";
import {Observable, Subject, takeUntil} from "rxjs";
import {AlertService} from "../../../../services/alert.service";
import {CategoryService} from "../../../../services/category.service";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-brand-details',
    standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgxEditorModule,
    TranslateModule
  ],
    templateUrl: './category-details.component.html',
    styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent implements OnInit, OnDestroy {
    editor: Editor = new Editor()
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];
    categoryForm!: FormGroup;
    category: Category | null = null;
    categorySlug?: string;
    categories$: Observable<Category> | null = null;

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private alertService: AlertService,
        private router: Router,
        private translate: TranslateService,
    ) {
      this.translate.setDefaultLang("vi")
    }

    @Input()
    set slug(categorySlug: string) {
        if (categorySlug && categorySlug !== 'new') {
            this.categorySlug = categorySlug;
            this.categories$ = this.categoryService.getBySlug(categorySlug);
        }
    }

    ngOnInit(): void {
        this.initForm();
        this.categories$
            ?.pipe(takeUntil(this.destroy$))
            .subscribe(category => {
                this.category = category;
                this.updateForm(category);
            });
    }

    generateSlug() {
        const productName = this.categoryForm.value.name;
        let slug = productName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        slug = slug.toLowerCase()
            .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+|-+$/g, '')
        this.categoryForm.patchValue({
            slug: slug
        })
    }

    isInvalid(fieldName: string) {
        const field = this.categoryForm.get(fieldName);
        return field?.invalid && (field?.dirty || field?.touched);
    }

    onSaveButtonClick() {
        const category = this.categoryForm.value;

        const save$ = this.category?.slug
            ? this.categoryService.update(category)
            : this.categoryService.create(category);

        save$.subscribe({
            next: (result) => {
                const createdCategory = result as Category;
                const slug = createdCategory?.slug || this.category?.slug;
                this.router.navigate(['/admin/categories/', slug]);
                this.alertService.showSuccessToast(
                    `Category has been saved successfully`
                );
            },
            error: (error) => this.handleError(error)
        });
    }

    private initForm() {
        this.categoryForm = this.fb.group({
            id: [0],
            name: ['', Validators.required],
            slug: ['', Validators.required],
            description: [''],
        });
    }

    private updateForm(category: Category) {
        this.categoryForm.patchValue({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
        });
    }

    private handleError(error: any) {
        const errorMessage = error.error?.errorMessage || 'An unknown error occurred';
        this.alertService.showErrorToast(errorMessage);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
