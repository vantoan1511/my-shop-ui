import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ValidationService } from '../../../../services/validation.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private validator: ValidationService) {}

  ngOnInit(): void {
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

  get rePasswordNotMatched() {
    return this.userForm.errors?.['mismatch'];
  }

  isInvalid(fieldName: string) {
    const field = this.userForm.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched);
  }

  onCreateButtonClick() {
    console.log('INFO - USER: ', this.userForm.value);
  }
}
