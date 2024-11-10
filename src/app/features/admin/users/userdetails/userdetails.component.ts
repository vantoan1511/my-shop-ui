import {Component, Input, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {Observable} from 'rxjs';
import {AlertService} from '../../../../services/alert.service';
import {UserService} from '../../../../services/user.service';
import {ValidationService} from '../../../../services/validation.service';
import {UserUpdate} from '../../../../types/user-update.type';
import {User} from '../../../../types/user.type';
import {PasswordReset} from '../../../../types/password-reset.type';
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './userdetails.component.html',
  styleUrl: './userdetails.component.scss',
})
export class DetailsComponent implements OnInit {
  userForm!: FormGroup;
  passwordForm!: FormGroup;
  userId: number | null = null;
  user: User | null = null;
  user$: Observable<User> | null = null;
  currentTabView: 'general' | 'credentials' = 'general';

  constructor(
    private fb: FormBuilder,
    private validator: ValidationService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang("vi")
  }

  ngOnInit(): void {
    this.initForm();
    this.initPasswordForm();
    this.user$?.subscribe((user) => {
      this.user = user;
      this.updateForm(user);
    });
  }

  isInvalid(fieldName: string) {
    const field = this.userForm.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched);
  }

  onSaveButtonClick() {
    console.log('INFO - USER: ', this.userForm.value);
    if (this.currentTabView === 'general') {
      if (this.userId) {
        const userUpdate: UserUpdate = this.userForm.value;
        userUpdate.id = this.userId;
        this.userService.update(this.userForm.value).subscribe({
          next: () => {
            this.router.navigate(['/admin/users/', this.userId]);
            this.alertService.showSuccessToast(
              `User has been saved successfully`
            );
          },
          error: (error) => {
            this.alertService.showErrorToast(error.error?.errorMessage);
          },
        });
      } else {
        this.userService.create(this.userForm.value).subscribe({
          next: (success) => {
            console.log(success);
            this.router.navigate(['/admin/users/', success.id]);
            this.alertService.showSuccessToast(
              `User ${success?.username} has been saved successfully`
            );
          },
          error: (error) => {
            this.alertService.showErrorToast(error.error?.errorMessage);
          },
        });
      }
    } else if (this.currentTabView === 'credentials') {
      const passwordReset: PasswordReset = this.passwordForm.value;
      if (this.userId) {
        this.userService.resetPassword(this.userId, passwordReset).subscribe({
          next: () => {
            this.router.navigate(['/admin/users/', this.userId]);
            this.alertService.showSuccessToast(
              `Password has been saved successfully`
            );
          },
          error: (error) => {
            this.alertService.showErrorToast(error.error?.errorMessage);
          },
        });
      }
    }
  }

  changeTab(tab: 'general' | 'credentials') {
    this.currentTabView = tab;
  }

  get rePasswordNotMatched() {
    return this.userForm.errors?.['mismatch'];
  }

  @Input()
  set id(userId: string) {
    this.userId = parseInt(userId);
    if (this.userId) {
      this.user$ = this.userService.getById(this.userId);
    }
  }

  private initForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailVerified: [false],
      enabled: [false],
      username: ['', Validators.required],
    });
  }

  private initPasswordForm() {
    this.passwordForm = this.fb.group({
      password: [''],
      rePassword: [''],
      temporary: [false],
    });

    this.userForm.addValidators(this.validator.passwordMatchValidator);
  }

  private updateForm(user: User) {
    this.userForm.patchValue({
      ...user
    });
  }
}
