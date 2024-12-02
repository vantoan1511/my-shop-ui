import {Injectable} from '@angular/core';
import Swal, {SweetAlertIcon} from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  showConfirmationAlert(
    title: string,
    text: string,
    type: SweetAlertIcon,
    callback: () => void
  ) {
    Swal.fire({
      title: title,
      text: text,
      icon: type,
      showCancelButton: true,
      confirmButtonText: 'Chắc chắn',
      cancelButtonText: 'Hủy',
      confirmButtonColor: 'var(--purple-9)',
      cancelButtonColor: 'var(--gray-6)',
    }).then((result) => (result.isConfirmed ? callback() : {}));
  }

  showErrorToast(text: string) {
    this.showAlert(text, 'error');
  }

  showSuccessToast(text: string) {
    this.showAlert(text, 'success');
  }

  private showAlert(text: string, type: SweetAlertIcon) {
    Swal.fire({
      text: text,
      icon: type,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      showCloseButton: true,
      timer: 5000,
    });
  }
}
