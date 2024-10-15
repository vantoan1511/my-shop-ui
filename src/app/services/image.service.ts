import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Image} from "../types/image.type";

@Injectable({
    providedIn: 'root',
})
export class ImageService {

    protected BASE_URL = environment.IMAGE_SERVICE_API;

    constructor(private http: HttpClient) {
    }

    getAvatarByUserId(userId: number): Observable<Blob> {
        return this.http.get(`${this.BASE_URL}/images/avatar/users/${userId}`, {
            responseType: "blob",
        });
    }

    getById(id: number): Observable<Blob> {
        return this.http.get(`${this.BASE_URL}/images/${id}`, {
            responseType: "blob",
        });
    }

    uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('altText', file.name);

        return this.http.post<Image>(`${this.BASE_URL}/images/upload`, formData);
    }

    setAvatar(imageId: number) {
        return this.http.patch(`${this.BASE_URL}/images/${imageId}/set-avatar`, {});
    }

    deleteImage(imageId: number) {
        return this.http.delete(`${this.BASE_URL}/images/${imageId}`);
    }
}
