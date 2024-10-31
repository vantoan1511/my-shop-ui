import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet,} from '@angular/router';
import {catchError, map, Subject, switchMap, takeUntil} from 'rxjs';
import {AlertService} from '../../services/alert.service';
import {AuthenticationService} from '../../services/authentication.service';
import {ImageService} from '../../services/image.service';
import {UserService} from '../../services/user.service';
import {ValidationService} from '../../services/validation.service';
import {constant} from "../../shared/constant";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";
import {PageRequest} from "../../types/page-request.type";
import {Image} from "../../types/image.type";
import {PagedResponse} from "../../types/response.type";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {allowedStatus, Order, OrderDetail} from "../../types/order.type";
import {OrderService} from "../../services/order.service";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule, TranslateModule, DatePipe, CurrencyPipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  passwordForm!: FormGroup;
  username!: string;
  userId: number | null = null;
  avatarUrl: string = constant.defaultAvatar;
  pageRequest: PageRequest = {page: 1, size: 10}
  uploaded: PagedResponse<Image> | null = null;
  private unsubscribe$ = new Subject<void>();

  orderResponse: PagedResponse<Order> | null = null;
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  orderDetails: Map<number, OrderDetail[]> = new Map()

  page = 0;
  size = 20;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private validator: ValidationService,
    private imageService: ImageService,
    private orderService: OrderService,
  ) {
    this.translate.setDefaultLang("vi");
  }

  ngOnInit(): void {
    this.username = this.getUsername();
    this.userForm = this.initUserProfileForm();
    this.passwordForm = this.initPasswordForm();
    this.getUserProfile();
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;

    this.orderService.getOrderById(order.id).pipe(map(order => order.orderDetails ?? [])).subscribe({
      next: (orderDetail) => {
        this.orderDetails.set(order.id, orderDetail)
      }
    })
  }

  loadOrders() {
    this.page = this.page + 1;
    this.orderService.getOrders({page: this.page, size: this.size}, '').subscribe(orders => {
      this.orderResponse = orders;
      this.orders = [...this.orders, ...orders.items];
    })
  }

  cancelOrder(selectedOrder: Order | null) {
    if (!selectedOrder) {
      return
    }

    if (!this.isAllowedToCancel(selectedOrder)) {
      this.alertService.showErrorToast(`Cannot cancel ${selectedOrder.orderStatus} order`);
      return
    }

    this.alertService.showConfirmationAlert('Confirm cancel order', 'Do you want to cancel this order?', 'warning', () => {
      this.orderService.cancelOrder(selectedOrder.id).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Canceled order successfully')
          this.updateCanceledOrderStatus(selectedOrder);
        },
        error: () => this.alertService.showErrorToast('Can not cancel this order')
      })
    })
  }

  isAllowedToCancel(selectedOrder: Order) {
    return allowedStatus.some(status => selectedOrder.orderStatus === status);
  }

  private updateCanceledOrderStatus(selectedOrder: Order) {
    this.orders.forEach(order => {
      if (order.id === selectedOrder.id) {
        order.orderStatus = 'CANCELLED';
      }
    })
  }

  private getUsername() {
    const username = this.route.snapshot.paramMap.get('username');
    return username ?? this.authService.username;
  }

  private initUserProfileForm() {
    return this.fb.group({
      username: [{value: '', disabled: true}],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      address: ['', Validators.required],
      address1: [''],
      address2: [''],
      address3: [''],
      address4: [''],
      gender: [{value: 'UNKNOWN'}],
    });
  }

  private initPasswordForm() {
    const passwordForm = this.fb.group({
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
    });
    passwordForm.addValidators(this.validator.passwordMatchValidator);
    return passwordForm;
  }

  private getUserProfile() {
    const username = this.getUsername();

    this.userService
      .getByUsername(username)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          this.alertService.showErrorToast('Failed to get user: ' + username);
          return [];
        }),
        switchMap((user) => {
          this.userForm.patchValue(user);
          this.userId = user.id;
          this.avatarUrl = this.createAvatarUrl(this.userId);
          return this.imageService.getUploaded(this.pageRequest);
        })
      )
      .subscribe((response) => this.uploaded = response);
  }

  protected onProfileFormSubmit() {
    if (this.userForm.valid) {
      this.userService
        .updateProfile(this.username, this.userForm.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.alertService.showSuccessToast('Profile updated successfully');
          },
          error: (error) => {
            this.alertService.showErrorToast('Failed to update profile');
          },
        });
    }
  }

  protected onPasswordFormSubmit() {
    if (this.passwordForm.valid) {
      this.userService
        .changePassword(this.username, this.passwordForm.get('password')?.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () =>
            this.alertService.showSuccessToast('Password changed successfully'),
          error: () =>
            this.alertService.showErrorToast('Failed to change password'),
        });
    }
  }

  protected previewImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) {
      return;
    }

    const file = input.files[0];

    if (!this.validateFile(file)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = document.getElementById(
        'avatar-preview'
      ) as HTMLImageElement;
      imgElement.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.imageService
      .uploadImage(file)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((resp) => {
          const avatarId = resp.id;
          return this.imageService.setAvatar(avatarId);
        }),
        catchError((error) => {
          this.alertService.showErrorToast('Failed to upload image');
          return [];
        })
      )
      .subscribe({
        next: () => {
          this.alertService.showSuccessToast('Updated avatar successfully')
        },
        error: () =>
          this.alertService.showErrorToast('Failed to update avatar'),
      });
  }

  get isValidProfileForm() {
    return this.userForm.valid;
  }

  get dirtyProfileForm() {
    return this.userForm.dirty;
  }

  get notMatchedPassword() {
    return this.passwordForm.errors?.['mismatch'];
  }

  private createAvatarUrl(userId: number) {
    return `${environment.IMAGE_SERVICE_API}/images/avatar/users/${userId}`;
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

  protected createImageUrl(imageId: number) {
    return `${environment.IMAGE_SERVICE_API}/images/${imageId}`;
  }

  protected onScrollGallery(event: Event) {
    if (this.isScrolledToEnd(event) && this.uploaded?.hasNext) {
      this.pageRequest = {...this.pageRequest, page: this.pageRequest.page + 1}
      this.fetchImages()
    }
  }

  protected setAvatar(image: Image) {
    this.imageService.setAvatar(image.id).subscribe({
      next: () => {
        this.avatarUrl = this.imageUrlFromId(image.id);
        this.alertService.showSuccessToast('Avatar changed successfully')
      },
    })
  }

  private isScrolledToEnd(event: Event) {
    const element = event.target as HTMLElement;
    return element.scrollHeight - element.scrollTop === element.clientHeight;
  }

  private fetchImages() {
    this.imageService.getUploaded(this.pageRequest).subscribe({
      next: (response) => {
        this.uploaded = {...response, items: [...(this.uploaded?.items || []), ...response.items]};
      }
    });
  }

  private imageUrlFromId(imageId: number): string {
    return `${environment.IMAGE_SERVICE_API}/images/${imageId}`;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly constant = constant;
}
