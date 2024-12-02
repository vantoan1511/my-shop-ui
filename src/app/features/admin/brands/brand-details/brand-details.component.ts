import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Brand} from "../../../../types/product.type";
import {Observable, Subject, takeUntil} from "rxjs";
import {AlertService} from "../../../../services/alert.service";
import {BrandService} from "../../../../services/brand.service";
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
  templateUrl: './brand-details.component.html',
  styleUrl: './brand-details.component.scss'
})
export class BrandDetailsComponent implements OnInit, OnDestroy {
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
  brandForm!: FormGroup;
  brand: Brand | null = null;
  brandSlug?: string;
  brands$: Observable<Brand> | null = null;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private alertService: AlertService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang("vi")
  }

  @Input()
  set slug(brandSlug: string) {
    if (brandSlug && brandSlug !== 'new') {
      this.brandSlug = brandSlug;
      this.brands$ = this.brandService.getBySlug(brandSlug);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.brands$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(brand => {
        this.brand = brand;
        this.updateForm(brand);
      });
  }

  generateSlug() {
    const productName = this.brandForm.value.name;
    let slug = productName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    slug = slug.toLowerCase()
      .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '')
    this.brandForm.patchValue({
      slug: slug
    })
  }

  isInvalid(fieldName: string) {
    const field = this.brandForm.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched);
  }

  onSaveButtonClick() {
    const brand = this.brandForm.value;

    const save$ = this.brand?.slug
      ? this.brandService.update(brand)
      : this.brandService.create(brand);

    save$.subscribe({
      next: (result) => {
        const createdBrand = result as Brand;
        const slug = createdBrand?.slug || this.brand?.slug;
        this.router.navigate(['/admin/brands/', slug]);
        this.alertService.showSuccessToast(
          `Brand has been saved successfully`
        );
      },
      error: (error) => this.handleError(error)
    });
  }

  private initForm() {
    this.brandForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
    });
  }

  private updateForm(brand: Brand) {
    this.brandForm.patchValue({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
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
