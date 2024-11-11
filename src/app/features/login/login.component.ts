import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });
  passwordVisible = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.translate.setDefaultLang('vi');
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
      } catch (error) {
        console.error('Login failed', error);
      } finally {
        this.loading = false;
      }
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
