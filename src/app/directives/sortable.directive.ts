import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { Sort, SortField } from '../types/sort.type';

@Directive({
  selector: '[appSortable]',
  standalone: true,
})
export class SortableDirective {
  @Input() sortField!: SortField;
  @Output() sortChange = new EventEmitter<Sort>();

  private descending = false;
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click')
  onClick() {
    this.descending = !this.descending;
    this.sortChange.emit({
      sort_by: this.sortField,
      descending: this.descending,
    });
    this.setIcon();
  }

  private setIcon() {
    const existingIcon = this.el.nativeElement.querySelector('i');
    if (existingIcon) {
      this.renderer.removeChild(this.el.nativeElement, existingIcon);
    }

    const icon = this.renderer.createElement('i');
    this.renderer.addClass(icon, 'mx-1');
    this.renderer.addClass(icon, 'bi');
    this.renderer.addClass(
      icon,
      this.descending ? 'bi-caret-down-fill' : 'bi-caret-up-fill'
    );
    this.renderer.appendChild(this.el.nativeElement, icon);
  }
}
