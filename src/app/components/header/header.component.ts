import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {constant} from "../../shared/constant";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  totalCarts = 0;

  constructor(
    protected authService: AuthenticationService,
    private translate: TranslateService,
    private cartService: CartService,
  ) {
    this.translate.setDefaultLang('vi');
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.cartService.totalCarts$.subscribe(count => this.totalCarts = count);
    }
  }

  protected readonly constant = constant;
}
