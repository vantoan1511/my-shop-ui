import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {catchError, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {ValidationService} from "../../../../services/validation.service";
import {AlertService} from "../../../../services/alert.service";
import {Category, Model, Product} from "../../../../types/product.type";
import {ProductService} from "../../../../services/product.service";
import {ModelService} from "../../../../services/model.service";
import {Response} from "../../../../types/response.type";
import {AsyncPipe} from "@angular/common";
import {CategoryService} from "../../../../services/category.service";
import {ImageService} from "../../../../services/image.service";
import {ContextMenuComponent} from "../../../../shared/components/context-menu/context-menu.component";
import {ProductImage} from "../../../../types/image.type";

@Component({
    selector: 'admin-product-details',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        AsyncPipe,
        ContextMenuComponent
    ],
    templateUrl: './admin-product-details.component.html',
    styleUrl: './admin-product-details.component.scss'
})
export class AdminProductDetailsComponent implements OnInit, OnDestroy {

    productForm!: FormGroup;
    product: Product | null = null;
    productSlug?: string;
    products$: Observable<Product> | null = null;
    models$: Observable<Response<Model>> | null = null;
    categories$: Observable<Response<Category>> | null = null;

    heroImageId = -1;

    productImages: ProductImage[] | null = null;
    imageMap: Map<number, string> = new Map();

    uploadedImageMenuOpen = false;

    selectedImageId: number | null = null;

    @ViewChild('contextMenu') contextMenu?: ContextMenuComponent;

    protected defaultHeroImage = 'https://via.placeholder.com/600x400';
    protected defaultThumbnail = 'https://via.placeholder.com/150';
    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private validator: ValidationService,
        private productService: ProductService,
        private imageService: ImageService,
        private modelService: ModelService,
        private categoryService: CategoryService,
        private alertService: AlertService,
        private router: Router,
    ) {
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
        this.products$
            ?.pipe(takeUntil(this.destroy$))
            .subscribe(product => {
                this.product = product;
                this.updateForm(product);

                this.productService.getImagesById(product.id).subscribe((productImages) => {
                    this.productImages = productImages;
                    this.heroImageId = productImages.filter(each => each.featured)
                        .map(each => each.imageId).at(0) || -1;
                    productImages.forEach(productImage => {
                        this.imageService.getById(productImage.imageId).subscribe(image => {
                            this.imageMap.set(image.id, `data:image/png;base64,${image.content}`);
                        })
                    })
                })
            });
        this.models$ = this.modelService.getAll();
        this.categories$ = this.categoryService.getAll();

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
                    return [];
                }),
                catchError((error) => {
                    this.alertService.showErrorToast('Failed to upload image');
                    return [];
                })
            )
            .subscribe({
                next: () => {
                    this.alertService.showSuccessToast('Updated product image successfully')
                },
                error: () =>
                    this.alertService.showErrorToast('Failed to update product image'),
            });
    }

    onChooseFromUploadedClick() {
        this.uploadedImageMenuOpen = !this.uploadedImageMenuOpen;
    }

    onImageSetFeatured(imageId: number) {
        console.log('Set feature: ', imageId);
        if (this.product) {
            this.productService.setFeaturedImage(this.product.id, imageId).subscribe({
                next: () => {
                    this.heroImageId = imageId;
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
                    this.imageMap.delete(imageId);
                    this.alertService.showSuccessToast('Removed image successfully')
                }
            })
        }
    }

    private initForm() {
        this.productForm = this.fb.group({
            id: [0],
            name: [''],
            slug: [''],
            description: [''],
            stockQuantity: [0],
            basePrice: [0],
            salePrice: [0],
            active: [false],
            weight: [0],
            color: [''],
            processor: [''],
            gpu: [''],
            ram: [0],
            storageType: [''],
            storageCapacity: [0],
            os: [''],
            screenSize: [0],
            batteryCapacity: [0],
            warranty: [0],
            viewCount: [0],
            userId: [0],
            model: [''],
            category: ['']
        });
    }

    private updateForm(product: Product) {
        this.productForm.patchValue({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            stockQuantity: product.stockQuantity,
            basePrice: product.basePrice,
            salePrice: product.salePrice,
            active: product.active,
            weight: product.weight,
            color: product.color,
            processor: product.processor,
            gpu: product.gpu,
            ram: product.ram,
            storageType: product.storageType,
            storageCapacity: product.storageCapacity,
            os: product.os,
            screenSize: product.screenSize,
            batteryCapacity: product.batteryCapacity,
            warranty: product.warranty,
            viewCount: product.viewCount,
            userId: product.userId,
            model: product.model.slug,
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
