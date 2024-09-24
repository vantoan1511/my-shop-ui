import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '../types/image.type';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getAvatarByUserId(userId: number) {
    return this.http.get<Blob>('http://localhost:8082/api/images/avatar', {
      params: {
        userId,
      },
      responseType: 'blob' as 'json',
    });
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
