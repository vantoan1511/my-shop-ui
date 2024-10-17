import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import {TranslateModule} from "@ngx-translate/core";
import {constant} from "../../shared/constant";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(protected authService: AuthenticationService) {}

  protected readonly constant = constant;
}
