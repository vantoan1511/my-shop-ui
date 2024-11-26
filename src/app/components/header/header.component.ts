import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {constant} from "../../shared/constant";
import {CartService} from "../../services/cart.service";
import {UserService} from "../../services/user.service";
import {User} from "../../types/user.type";
import {environment} from "../../../environments/environment";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslateModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  totalCarts = 0;
  user: User | null = null;

  keyword = ''

  constructor(
    protected authService: AuthenticationService,
    private translate: TranslateService,
    private cartService: CartService,
    private userService: UserService,
    private router: Router,
  ) {
    this.translate.setDefaultLang('vi');
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.cartService.totalCarts$.subscribe(count => this.totalCarts = count);
      this.userService.getByUsername(this.authService.username).subscribe(user => this.user = user);
    }
  }

  onSearch() {
    if (this.keyword.trim()) {
      this.router.navigate(['/may-tinh-xach-tay'], {queryParams: {keyword: this.keyword.trim()}});
    }
  }

  get avatarUrl() {
    try {
      return `${environment.IMAGE_SERVICE_API}/images/avatar/users/${this.user?.id}`;
    } catch (error) {
      return constant.defaultAvatar;
    }
  }

  get defaultAvatar() {
    return constant.defaultAvatar;
  }

  protected readonly constant = constant;
}
