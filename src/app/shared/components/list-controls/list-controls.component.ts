import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-controls',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './list-controls.component.html',
  styleUrl: './list-controls.component.scss',
})
export class ListControlsComponent {
  @Output() refreshButtonClick = new EventEmitter();
  @Output() deleteButtonClick = new EventEmitter();

  onRefreshButtonClick() {
    this.refreshButtonClick.emit();
  }

  onDeleteButtonClick() {
    this.deleteButtonClick.emit();
  }
}
