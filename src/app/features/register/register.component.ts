import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../services/authentication.service";
import {UserRegister} from "../../types/user.type";
import {UserService} from "../../services/user.service";
import {AlertService} from "../../services/alert.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    NgClass
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, this.usernameValidator]],
    password: ['', Validators.required],
    firstName: ['', [Validators.required, this.alphabeticValidator]],
    lastName: ['', [Validators.required, this.alphabeticValidator]],
    email: ['', [Validators.required, Validators.email]],
    rePassword: ['', Validators.required],
  }, {validators: [this.passwordMatchValidator]});
  passwordVisible = false;
  loading = false;
  registerMessage: string | null = null;
  registerFailed = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
  ) {
    this.translate.setDefaultLang('vi');

    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.authService.setRedirectUrl(returnUrl);
  }

  get f() {
    return this.registerForm.controls
  }

  get formAsUserRegister() {
    return this.registerForm.value as UserRegister;
  }

  async onRegisterFormSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const userRegister = {...this.formAsUserRegister};
      console.log(userRegister);
      this.userService.register(userRegister).subscribe({
        next: () => {
          this.registerMessage = this.translate.instant('REGISTER_SUCCESS');
          this.registerFailed = false;
          this.registerForm.reset()
          this.loading = false;
        },
        error: ({error}) => {
          this.registerMessage = error.errorMessage as string
          this.registerFailed = true
          this.loading = false;
        },
      })
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  passwordMatchValidator(formGroup: AbstractControl): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const rePassword = formGroup.get('rePassword')?.value;
    if (password !== rePassword) {
      return {passwordMismatch: true};
    }
    return null;
  }

  alphabeticValidator(control: AbstractControl) {
    const value = control.value;
    const regex = /^[\p{L}][\p{L}\s]*$/u;

    if (value && !regex.test(value)) {
      return {invalidAlphabetic: true};
    }
    return null;
  }

  usernameValidator(control: AbstractControl) {
    const value = control.value;
    const regex = /^[A-Za-z].*$/;

    if (value && !regex.test(value)) {
      return {invalidUsername: true};
    }
    return null;
  }
}
