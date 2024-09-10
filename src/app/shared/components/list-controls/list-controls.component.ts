import { Component, EventEmitter, Output } from '@angular/core';

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
    this.deleteSelected.emit();
  }
}
