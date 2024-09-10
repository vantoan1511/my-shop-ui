import {
    ComponentRef,
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewContainerRef
} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSort, faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
import {Sort} from "../../types/sort";

@Directive({
    selector: '[appSortable]',
    standalone: true
})
export class SortableDirective {

    @Input() sortableColumn!: string;
    @Input() direction: 'asc' | 'desc' | '' = '';
    @Output() changeSort = new EventEmitter<Sort>();

    private iconComponentRef!: ComponentRef<FaIconComponent>;

    constructor(private el: ElementRef,
                private viewContainer: ViewContainerRef) {
        this.el.nativeElement.style.display = 'flex';
        this.el.nativeElement.style.gap = '1rem';
        this.el.nativeElement.style.cursor = 'pointer';
    }

    @HostListener('click') onClick() {
        if (this.direction === '') {
            this.direction = 'asc';
        } else if (this.direction === 'asc') {
            this.direction = 'desc';
        } else {
            this.direction = '';
        }

        this.changeSort.emit({sortBy: this.sortableColumn, descending: this.direction === 'desc'});
        this.setSortIcon();
    }

    private setSortIcon() {
        if (this.iconComponentRef) {
            this.iconComponentRef.destroy();
        }

        this.iconComponentRef = this.viewContainer.createComponent(FaIconComponent);
        const iconElement = this.iconComponentRef.location.nativeElement;

        if (this.direction === 'asc') {
            this.iconComponentRef.instance.icon = faSortUp;
        } else if (this.direction === 'desc') {
            this.iconComponentRef.instance.icon = faSortDown;
        } else {
            this.iconComponentRef.instance.icon = faSort;
            iconElement.style.display = 'none';
            this.iconComponentRef.destroy();
        }

        this.el.nativeElement.appendChild(iconElement);
        this.iconComponentRef.instance.render();
    }

}
