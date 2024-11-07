import {Component, EventEmitter, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-list-controls',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './list-controls.component.html',
  styleUrl: './list-controls.component.scss',
})
export class ListControlsComponent {
  @Output() refreshButtonClick = new EventEmitter();
  @Output() deleteButtonClick = new EventEmitter();

  constructor(
    private translateService: TranslateService,
  ) {
    this.translateService.setDefaultLang("vi")
  }

  onRefreshButtonClick() {
    this.refreshButtonClick.emit();
  }

  onDeleteButtonClick() {
    this.deleteButtonClick.emit();
  }
}
