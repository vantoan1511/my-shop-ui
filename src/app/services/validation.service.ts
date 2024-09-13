import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  passwordMatchValidator = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;
    return password && rePassword && password !== rePassword
      ? { mismatch: true }
      : null;
  };
}
