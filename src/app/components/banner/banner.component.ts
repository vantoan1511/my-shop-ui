import {Component} from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent {
  slides = [
    {src: '/images/banner/banner1.png', title: 'First Slide', description: 'Description for the first slide.'},
    {
      src: '/images/banner/banner2.jpg',
      title: 'Second Slide',
      description: 'Description for the second slide.'
    },
  ];
}
