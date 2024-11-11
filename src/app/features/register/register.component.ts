import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    rePassword: ['', Validators.required],
  });
  passwordVisible = false;
  loading = false;
  loginFailed = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.translate.setDefaultLang('vi');

    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.authService.setRedirectUrl(returnUrl);
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/'])
    }
  }

  get f() {
    return this.loginForm.controls
  }

  async onLoginFormSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      try {
        const {username, password} = this.loginForm.value;
        const response = await this.authService.login(username, password);
        console.log('Login successful', response);

        const redirectUrl = this.authService.getRedirectUrl() || '/';
        await this.router.navigateByUrl(redirectUrl);
      } catch (error) {
        console.error('Login failed', error);
        this.loginFailed = true;
      } finally {
        this.loading = false;
      }
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
