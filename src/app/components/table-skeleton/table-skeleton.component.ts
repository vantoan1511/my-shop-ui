import {Component, Input, input} from '@angular/core';
import {SkeletonComponent} from "../skeleton/skeleton.component";

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [
    SkeletonComponent
  ],
  templateUrl: './table-skeleton.component.html',
  styleUrl: './table-skeleton.component.scss'
})
export class TableSkeletonComponent {
  @Input() colCount = 1;
  @Input() rowCount = 5;
  protected readonly Array = Array;
}
