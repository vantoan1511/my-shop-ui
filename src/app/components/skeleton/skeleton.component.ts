import {Component, Input} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  @Input() width: string | null = null;
  @Input() height: string | null = null;
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';
  @Input() shape: 'rectangle' | 'circle' = 'rectangle';
  @Input() fluid = false;
}
