import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Brand, Model} from "../../../../types/product.type";
import {Observable, Subject, takeUntil} from "rxjs";
import {AlertService} from "../../../../services/alert.service";
import {ModelService} from "../../../../services/model.service";
import {BrandService} from "../../../../services/brand.service";
import {PagedResponse} from "../../../../types/response.type";
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
  templateUrl: './model-details.component.html',
  styleUrl: './model-details.component.scss'
})
export class ModelDetailsComponent implements OnInit, OnDestroy {
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
  modelForm!: FormGroup;
  model: Model | null = null;
  modelSlug?: string;
  models$: Observable<Model> | null = null;
  brands$: Observable<PagedResponse<Brand>> | null = null;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private modelService: ModelService,
    private brandService: BrandService,
    private alertService: AlertService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang("vi")
  }

  @Input()
  set slug(modelSlug: string) {
    if (modelSlug && modelSlug !== 'new') {
      this.modelSlug = modelSlug;
      this.models$ = this.modelService.getBySlug(modelSlug);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.models$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(model => {
        this.model = model;
        this.updateForm(model);
      });
    this.brands$ = this.brandService.getBy({page: 1, size: 999});
  }

  generateSlug() {
    const productName = this.modelForm.value.name;
    let slug = productName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    slug = slug.toLowerCase()
      .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '')
    this.modelForm.patchValue({
      slug: slug
    })
  }

  isInvalid(fieldName: string) {
    const field = this.modelForm.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched);
  }

  onSaveButtonClick() {
    const model = this.modelForm.value;

    const save$ = this.model?.slug
      ? this.modelService.update(model)
      : this.modelService.create(model);

    save$.subscribe({
      next: (result) => {
        const createdModel = result as Model;
        const slug = createdModel?.slug || this.model?.slug;
        this.router.navigate(['/admin/models/', slug]);
        this.alertService.showSuccessToast(
          `Model has been saved successfully`
        );
      },
      error: (error) => this.handleError(error)
    });
  }

  private initForm() {
    this.modelForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      slug: ['', Validators.required],
      brandSlug: ['', Validators.required],
      description: [''],
    });
  }

  private updateForm(model: Model) {
    this.modelForm.patchValue({
      id: model.id,
      name: model.name,
      slug: model.slug,
      description: model.description,
      brandSlug: model.brand.slug
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
