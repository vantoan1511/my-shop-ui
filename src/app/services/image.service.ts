import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '../types/image.type';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getAvatar(username: string) {
    return this.http.get<string>(
      'http://localhost:8082/api/images/avatar/' + username
    );
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('altText', file.name);

    return this.http.post<Image>('http://localhost:8082/api/images', formData);
  }

  setAvatar(imageId: number) {
    return this.http.put('http://localhost:8082/api/images/' + imageId, {});
  }
}
