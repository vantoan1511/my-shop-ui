import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Image} from '../types/image.type';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ImageService {

    protected BASE_URL = environment.IMAGE_SERVICE_API;

    constructor(private http: HttpClient) {
    }

    getAvatarByUserId(userId: number) {
        return this.http.get<Blob>(`${this.BASE_URL}/images/avatar`, {
            params: {
                userId,
            },
            responseType: 'blob' as 'json',
        });
    }

    getById(id: number) {
        return this.http.get<Image>(`${this.BASE_URL}/images/${id}`);
    }

    uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('altText', file.name);

        return this.http.post<Image>(`${this.BASE_URL}/images`, formData);
    }

    setAvatar(imageId: number) {
        return this.http.patch(`${this.BASE_URL}/images/` + imageId, {});
    }
}
