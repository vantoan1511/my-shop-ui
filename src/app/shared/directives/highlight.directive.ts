import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    standalone: true
})
export class HighlightDirective {

    constructor(private element: ElementRef) {
        element.nativeElement.style.background = 'yellow';
    }

}
