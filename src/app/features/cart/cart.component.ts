import {Component, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CurrencyPipe, PercentPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {Cart} from "../../types/cart.type";
import {constant} from "../../shared/constant";
import {CartService} from "../../services/cart.service";
import {PagedResponse} from "../../types/response.type";
import {PageRequest} from "../../types/page-request.type";
import {ProductService} from "../../services/product.service";
import {Product} from "../../types/product.type";
import {forkJoin, map, switchMap, tap} from "rxjs";
import {AlertService} from "../../services/alert.service";
import {environment} from "../../../environments/environment";
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../../services/user.service";
import {User} from "../../types/user.type";
import {OrderService} from "../../services/order.service";
import {PaymentService} from "../../services/payment.service";
import {NgxMaskDirective} from "ngx-mask";
import {OrderType} from "../../types/order.type";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    TranslateModule,
    CurrencyPipe,
    RouterLink,
    FormsModule,
    PercentPipe,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  isCheckout = false
  selectedPaymentMethod: 'CASH' | 'BANKING' = 'CASH';
  cartResponse: PagedResponse<Cart> | null = null;
  cartItems: Cart[] = [];
  products: Map<string, Product> = new Map();
  productFeaturedImage: Map<string, string> = new Map();
  pageRequest: PageRequest = {page: 1, size: 20}
  loading = false;

  user: User | null = null;
  userAddresses: string[] = [];
  selectedAddress = '';
  selectedPhoneNumber = '';

  checkoutForm = this.fb.group({
    phone: [this.user?.phone || '', Validators.required],
    shippingAddress: [this.user?.address || '', [Validators.required, this.notBlankValidator]],
    paymentMethod: ['CASH', Validators.required]
  })

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private translate: TranslateService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private userService: UserService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private fb: FormBuilder,
  ) {
    this.translate.setDefaultLang("vi");
  }

  ngOnInit(): void {
    this.fetchCarts();
  }

  get totalDiscountedPrice(): number {
    return this.totalBasePrice() - this.totalAmount;

  }

  get discountedPercent(): number {
    return ((this.totalDiscountedPrice / this.totalBasePrice()));
  }

  totalBasePrice(): number {
    return this.cartItems.reduce((sum, item) => {
      const product = this.getProduct(item)
      if (product) {
        const price = product.basePrice;
        return sum + price * item.quantity;
      }
      return sum;
    }, 0);
  }

  get totalAmount(): number {
    return this.cartItems.reduce((sum, item) => {
      return sum + this.getAmount(item);
    }, 0);
  }

  getAmount(item: Cart): number {
    const product = this.getProduct(item)
    if (product) {
      const price = product.salePrice;
      return price * item.quantity;
    }
    return 0;
  }

  increaseQuantity(item: Cart): void {
    const product = this.getProduct(item)
    if (!product) {
      return;
    }

    const stock = product.stockQuantity;
    if (item.quantity < stock) {
      item.quantity++;
      this.updateQuantity(item)
    }
  }

  decreaseQuantity(item: Cart): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateQuantity(item)
    }
  }

  updateQuantity(item: Cart): void {
    this.validateQuantity(item);
    this.cartService.updateQuantity(item.id, item.quantity).subscribe({
      next: () => console.log("Update cart quantity successfully"),
    });
  }

  validateQuantity(item: Cart): void {
    if (item.quantity < 1) {
      item.quantity = 1;
    }

    const stock = this.stock(item)
    if (item.quantity > stock) {
      item.quantity = stock
    }
  }

  removeFromCart(item: Cart): void {
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(cart => cart.id !== item.id)
        this.alertService.showSuccessToast("Removed successfully")
      },
      error: () => this.alertService.showErrorToast("An error occurred")
    })
  }

  stock(item: Cart) {
    const product = this.getProduct(item)

    if (!product) {
      return 0;
    }

    return product.stockQuantity
  }

  getProduct(item: Cart) {
    return this.products.get(item.productSlug);
  }

  getImage(item: Cart) {
    return this.productFeaturedImage.get(item.productSlug);
  }

  proceedToCheckout() {
    this.isCheckout = true;

    this.fetchUser();
  }

  placeOrder() {
    if (this.checkoutForm.valid) {
      console.log('Checkout Form: ', this.checkoutForm.value);
      const checkoutFormValue = this.checkoutForm.value;
      const shippingAddress = [checkoutFormValue.phone, checkoutFormValue.shippingAddress].join(', ');
      const order: OrderType = {
        shippingAddress,
        paymentMethod: checkoutFormValue.paymentMethod as "CASH" || "BANKING",
        items: this.cartItems
      }
      console.log("Order request: ", order)
      this.orderService.createOrder(order).subscribe({
        next: (orderResponse) => {
          if (orderResponse.paymentMethod === 'BANKING') {
            this.paymentService.getPaymentUrl(orderResponse.id).subscribe({
              next: ({processUrl}) => {
                window.location.href = processUrl
              }
            })
          } else {
            this.translate.get("PLACED_ORDER_SUCCESS").subscribe((value) => this.alertService.showSuccessToast(value))
            this.cartService.clearCart().subscribe({
              next: () => {
                this.cartResponse = null;
                this.cartItems = []
                this.isCheckout = false;
              }
            })
          }
        }
      })
    } else {
      this.checkoutForm.markAllAsTouched()
    }
  }

  backToCart() {
    this.isCheckout = false;
  }

  private fetchCarts() {
    this.loading = true

    this.cartService.getCart(this.pageRequest).pipe(
      switchMap(cartResponse => {
        this.cartResponse = cartResponse;
        this.cartItems = cartResponse.items;

        const productObservables = cartResponse.items.map(item => this.fetchProduct(item.productSlug))

        return forkJoin(productObservables);
      }),

      map(products => products.reduce((acc, product) => {
        acc.set(product.slug, product)
        return acc;
      }, new Map<string, Product>)),
    ).subscribe({
      next: productMap => {
        this.products = productMap;
        this.loading = false;
        this.fetchProductFeaturedImage(productMap)
      },
      error: () => this.loading = false
    })
  }

  private fetchProduct(productSlug: string) {
    return this.productService.getBySlug(productSlug);
  }

  private fetchProductFeaturedImage(productMap: Map<string, Product>) {
    Array.from(productMap.entries()).map(([slug, product]) =>
      this.productService.getImagesById(product.id).subscribe({
        next: productImages => {
          const featuredImage = productImages.find(image => image.featured);
          const imageUrl = featuredImage ? this.imageUrl(featuredImage.imageId) : constant.defaultHeroImageUrl;
          this.productFeaturedImage.set(slug, imageUrl);
        }
      })
    );
  }

  private imageUrl(imageId: number) {
    return `${environment.IMAGE_SERVICE_API}/images/${imageId}?size=SMALL`;
  }

  private fetchUser() {
    const username = this.authService.username;
    this.userService.getByUsername(username).pipe(
      tap(user => this.updateCheckoutForm(user)),
      map(user => {
        this.user = user;
        this.selectedPhoneNumber = user.phone
        return this.listAddresses(user)
      })
    ).subscribe({
      next: addresses => this.userAddresses = addresses
    })
  }

  private listAddresses(user: User) {
    return Array.of(user.address, user.address1, user.address2, user.address3, user.address4).filter(each => each);
  }

  private updateCheckoutForm(user: User) {
    this.checkoutForm.patchValue({
      ...user,
      shippingAddress: user.address
    })
  }

  notBlankValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const isBlank = value.trim().length === 0;
    return isBlank ? {blank: true} : null;
  }

  protected readonly constant = constant;
  protected readonly Array = Array;
}
