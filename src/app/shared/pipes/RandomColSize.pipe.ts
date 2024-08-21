import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'randomColSize',
    standalone: true
})
export class RandomColSizePipe implements PipeTransform {
    transform(value: number): number {
        const sizes = [2, 4, 6, 8, 10, 12];
        const randomIndex = Math.floor(Math.random() * sizes.length);
        return sizes[randomIndex];
    }
}