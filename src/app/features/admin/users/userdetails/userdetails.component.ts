import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../../../../services/alert.service';
import { UserService } from '../../../../services/user.service';
import { ValidationService } from '../../../../services/validation.service';
import { User } from '../../../../types/user.type';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './userdetails.component.html',
  styleUrl: './userdetails.component.scss',
})
export class DetailsComponent implements OnInit {
  userForm!: FormGroup;
  userId: number | null = null;
  user: User | null = null;
  user$: Observable<User> | null = null;
  currentTabView: 'general' | 'credentials' = 'general';

  constructor(
    private fb: FormBuilder,
    private validator: ValidationService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
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
    this.userService.create(this.userForm.value).subscribe({
      next: (success) => {
        console.log(success);
        this.router.navigate(['/admin/users/', success.id]);
        this.alertService.showSuccessToast(
          `User ${success?.username} has been saved successfully`
        );
      },
      error: (error) => {
        console.log(error);
        this.alertService.showErrorToast(error.error?.errorMessage);
      },
    });
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
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
    });

    this.userForm.addValidators(this.validator.passwordMatchValidator);
  }

  private updateForm(user: User) {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    });
  }
}
