import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
    selector: '[appEditable]',
    standalone: true
})
export class EditableDirective {

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.setInitialStyles();
    }

    private setInitialStyles() {
        const initialStyles = {
            flex: '1',
            borderColor: 'transparent',
            padding: '7px 7px 8px',
            lineHeight: '1.28',
            resize: this.el.nativeElement.tagName === 'TEXTAREA' ? 'none' : 'auto',
            boxShadow: 'transparent 0px 0px 0px 1px',
            transition: 'background 0.1s ease 0s',
            overflow: 'auto',
            overflowY: 'hidden',
            borderRadius: '3px',
            appearance: 'none',
            backgroundColor: 'transparent'
        };
        this.setStyles(initialStyles);
    }

    private setStyles(styles: { [key: string]: string }) {
        for (const [key, value] of Object.entries(styles)) {
            this.renderer.setStyle(this.el.nativeElement, key, value);
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.el.nativeElement.matches(':focus')) {
            this.setStyles({backgroundColor: 'rgb(235, 236, 240)'});
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        if (!this.el.nativeElement.matches(':focus')) {
            this.setStyles({backgroundColor: 'transparent'});
        }
    }

    @HostListener('focus') onFocus() {
        this.setStyles({
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid #4c9aff',
            boxShadow: '0 0 0 1px #4c9aff',
            outline: 'none'
        });
    }

    @HostListener('blur') onBlur() {
        this.setStyles({
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'transparent 0px 0px 0px 1px'
        });
    }

    @HostListener('keydown.enter', ['$event']) onKeydownEnter(event: KeyboardEvent) {
        event.preventDefault();
        this.el.nativeElement.blur();
    }

}
