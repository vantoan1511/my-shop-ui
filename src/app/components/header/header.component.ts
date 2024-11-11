import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {constant} from "../../shared/constant";
import {CartService} from "../../services/cart.service";
import {UserService} from "../../services/user.service";
import {User} from "../../types/user.type";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  totalCarts = 0;
  user: User | null = null;

  constructor(
    protected authService: AuthenticationService,
    private translate: TranslateService,
    private cartService: CartService,
    private userService: UserService,
  ) {
    this.translate.setDefaultLang('vi');
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.cartService.totalCarts$.subscribe(count => this.totalCarts = count);

      this.userService.getByUsername(this.authService.username).subscribe(user => this.user = user);
    }
  }

  get avatarUrl() {
    if (this.user && this.user.id) {
      return `${environment.IMAGE_SERVICE_API}/images/avatar/users/${this.user.id}`;
    }
    return constant.defaultAvatar
  }

  protected readonly constant = constant;
}
