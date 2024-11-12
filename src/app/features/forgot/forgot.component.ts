import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.scss'
})
export class ForgotComponent {
  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
  });
  forgotSubmit = false;
  loading = false

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.translate.setDefaultLang('vi');

    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.authService.setRedirectUrl(returnUrl);
  }

  async onForgotFormSubmit() {
    if (this.forgotForm.valid) {
      this.forgotSubmit = true;
    }
  }

}
