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
    {
      src: '/images/banner/banner1.png',
      title: 'Banner 1',
    },
    {
      src: '/images/banner/banner2.jpg',
      title: 'Banner 2',
    },
    {
      src: '/images/banner/banner3.png',
      title: 'Banner 3',
    },
    {
      src: '/images/banner/banner4.jpg',
      title: 'Banner 4',
    },
    {
      src: '/images/banner/banner5.png',
      title: 'Banner 5',
    },
    {
      src: '/images/banner/banner6.png',
      title: 'Banner 6',
    },
  ];
}
