import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {BehaviorSubject, catchError, Observable, Subject, switchMap, takeUntil, tap} from "rxjs";
import {AlertService} from "../../../../services/alert.service";
import {Brand, Category, Model, Product} from "../../../../types/product.type";
import {ProductService} from "../../../../services/product.service";
import {ModelService} from "../../../../services/model.service";
import {PagedResponse} from "../../../../types/response.type";
import {AsyncPipe} from "@angular/common";
import {CategoryService} from "../../../../services/category.service";
import {ImageService} from "../../../../services/image.service";
import {ContextMenuComponent} from "../../../../shared/components/context-menu/context-menu.component";
import {ProductImage} from "../../../../types/image.type";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
import {constant} from "../../../../shared/constant";
import {environment} from "../../../../../environments/environment";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgxMaskDirective} from "ngx-mask";
import {BrandService} from "../../../../services/brand.service";

@Component({
  selector: 'admin-product-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    ContextMenuComponent,
    NgxEditorModule,
    TranslateModule,
    NgxMaskDirective,
    FormsModule
  ],
  templateUrl: './admin-product-details.component.html',
  styleUrl: './admin-product-details.component.scss'
})
export class AdminProductDetailsComponent implements OnInit, OnDestroy {
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
  productForm!: FormGroup;
  product: Product | null = null;
  productSlug?: string;
  products$: Observable<Product> | null = null;
  categories$: Observable<PagedResponse<Category>> | null = null;

  heroImageUrl = constant.defaultHeroImageUrl

  imageUrls: Map<number, string> = new Map();
  selectedImageId: number | null = null;

  private productImagesSubject = new BehaviorSubject<ProductImage[]>([]);
  productImages$ = this.productImagesSubject.asObservable()

  brands: Brand[] = [];
  models: Model[] = []
  filterModels: Model[] = [];

  @ViewChild('contextMenu') contextMenu?: ContextMenuComponent;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private imageService: ImageService,
    private modelService: ModelService,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private router: Router,
    private translate: TranslateService,
    private brandService: BrandService,
  ) {
    this.translate.setDefaultLang("vi");
  }

  @Input()
  set slug(productSlug: string) {
    if (productSlug && productSlug !== 'new') {
      this.productSlug = productSlug;
      this.products$ = this.productService.getBySlug(productSlug);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.getBrands();
    this.getModels();
    this.products$
      ?.pipe(takeUntil(this.destroy$), tap(product => this.getProductImages(product)))
      .subscribe(product => {
        this.product = product;
        this.updateForm(product);
      });
    this.categories$ = this.categoryService.getAll();
  }

  onSelectedBrandChange() {
    this.filterModelsByBrand(this.productForm.get('brand')?.value)
  }

  filterModelsByBrand(brand: string) {
    this.filterModels = this.models.filter(model =>
      model.brand.slug === brand
    )
  }

  getBrands() {
    this.brandService.getBy({size: 100, page: 1}).subscribe((resp) => this.brands = resp.items)
  }

  getModels() {
    this.modelService.getBy({size: 100, page: 1}).subscribe((resp) => {
      this.models = resp.items
      this.filterModels = resp.items
    })
  }

  getProductImages(product: Product) {
    this.productService.getImagesById(product.id).subscribe((productImages) => {
      this.productImagesSubject.next(productImages);
      const featured = productImages.find(image => image.featured)
      if (featured) {
        this.heroImageUrl = this.createImageUrl(featured.imageId)
      }
    })
  }

  generateSlug() {
    const productName = this.productForm.value.name;
    let slug = productName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    slug = slug.toLowerCase()
      .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '')
    this.productForm.patchValue({
      slug: slug
    })
  }

  isInvalid(fieldName: string) {
    const field = this.productForm.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched);
  }

  onSaveButtonClick() {
    const product = this.productForm.value;

    const save$ = this.product?.slug
      ? this.productService.update(product)
      : this.productService.create(product);

    save$.subscribe({
      next: (result) => {
        const createdProduct = result as Product;
        const slug = createdProduct?.slug || this.product?.slug;
        this.router.navigate(['/admin/products/', slug]);
        this.alertService.showSuccessToast(
          `Product has been saved successfully`
        );
      },
      error: (error) => this.handleError(error)
    });
  }

  showContextMenu(event: MouseEvent, imageId: number) {
    this.selectedImageId = imageId;
    this.contextMenu?.onContextMenu(event);
  }

  onUploadImageButtonClick(event: Event) {
    if (!this.product) {
      return;
    }

    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) {
      return;
    }

    const file = input.files[0];

    if (!this.validateFile(file)) {
      return;
    }

    this.imageService
      .uploadImage(file)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((resp) => {
          const imageId = resp.id;
          if (this.product) {
            return this.productService.updateImages(this.product?.id, [imageId]);
          }
          this.imageUrls.set(resp.id, this.createImageUrl(resp.id));
          return [];
        }),
        catchError(() => {
          this.alertService.showErrorToast('Failed to upload image');
          return [];
        })
      )
      .subscribe({
        next: () => {
          this.alertService.showSuccessToast('Updated product image successfully')
          this.getProductImages(<Product>this.product)
        },
        error: () =>
          this.alertService.showErrorToast('Failed to update product image'),
      });
  }

  onImageSetFeatured(imageId: number) {
    if (this.product) {
      this.productService.setFeaturedImage(this.product.id, imageId).subscribe({
        next: () => {
          this.heroImageUrl = this.createImageUrl(imageId)
          this.alertService.showSuccessToast('Featured image successfully')
        },
      });
    }
  }

  onImageRemove(imageId: number) {
    console.log('Set feature: ', imageId);
    if (this.product) {
      this.productService.removeImage(this.product.id, [imageId]).subscribe({
        next: () => {
          this.imageUrls.delete(imageId);
          this.alertService.showSuccessToast('Removed image successfully')
        }
      })
    }
  }

  private initForm() {
    this.productForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
      stockQuantity: [0, Validators.min(0)],
      basePrice: [0, Validators.min(0)],
      salePrice: [0, Validators.min(0)],
      active: [false],
      weight: [0, Validators.min(0)],
      color: [''],
      processor: [''],
      gpu: [''],
      ram: [0, Validators.min(0)],
      storageType: [''],
      storageCapacity: [0, Validators.min(0)],
      os: [''],
      screenSize: [0, Validators.min(0)],
      batteryCapacity: [0, Validators.min(0)],
      warranty: [0, Validators.min(0)],
      viewCount: [0],
      userId: [],
      model: [''],
      brand: [''],
      category: ['']
    });
  }

  private updateForm(product: Product) {
    this.productForm.patchValue({
      ...product,
      model: product.model.slug,
      brand: product.model.brand.slug,
      category: product.category.slug
    });
  }

  private handleError(error: any) {
    const errorMessage = error.error?.errorMessage || 'An unknown error occurred';
    this.alertService.showErrorToast(errorMessage);
  }

  private validateFile(file: File) {
    if (!file) {
      this.alertService.showErrorToast('File is empty');
      return false;
    }

    if (!this.validFileSize(file)) {
      this.alertService.showErrorToast('File exceeds limit of 1MB');
      return false;
    }

    if (!this.validFileType(file)) {
      this.alertService.showErrorToast(
        'Invalid file type. Only JPEG and PNG allowed'
      );
      return false;
    }

    return true;
  }

  private validFileSize(file: File) {
    const MAX_FILE_SIZE = 1048576;
    return file.size <= MAX_FILE_SIZE;
  }

  private validFileType(file: File) {
    const validTypes = ['image/jpeg', 'image/png'];
    return validTypes.includes(file.type);
  }

  createImageUrl(imageId: number) {
    return `${environment.IMAGE_SERVICE_API}/images/${imageId}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
