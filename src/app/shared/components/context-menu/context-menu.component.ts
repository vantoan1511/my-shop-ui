import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
    selector: 'app-context-menu',
    standalone: true,
    imports: [
        NgStyle
    ],
    templateUrl: './context-menu.component.html',
    styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {
    visible = false;
    position = {x: 0, y: 0};

    @Input() imageId: number | null = null;
    @Output() imageSetFeatured = new EventEmitter();
    @Output() imageRemove = new EventEmitter();

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        this.visible = false;
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent) {
        event.preventDefault();
        this.position.x = event.pageX;
        this.position.y = event.pageY;

        this.visible = true;
    }

    onSetFeatured() {
        this.visible = false;
        this.imageSetFeatured.emit(this.imageId);
    }

    onRemove() {
        this.visible = false;
        this.imageRemove.emit(this.imageId);
    }

}
