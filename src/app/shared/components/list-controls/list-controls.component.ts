import { Component, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-controls',
  standalone: true,
  imports: [],
  templateUrl: './list-controls.component.html',
  styleUrl: './list-controls.component.scss',
})
export class ListControlsComponent {
  @Output() deleteSelected = new EventEmitter();

  onDeleteSelected() {
    this.showAlert(() => this.deleteSelected.emit());
  }

  private showAlert(callback: () => void) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover these items!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: 'var(--purple-9)',
      cancelButtonColor: 'var(--gray-6)',
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }
}
