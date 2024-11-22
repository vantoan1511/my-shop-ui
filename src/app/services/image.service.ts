import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Image} from "../types/image.type";
import {PageRequest} from "../types/page-request.type";
import {PagedResponse} from "../types/response.type";

@Injectable({
    providedIn: 'root',
})
export class ImageService {

    protected BASE_URL = environment.IMAGE_SERVICE_API;
    protected IMAGE_SERVICE_API_URL = `${this.BASE_URL}/images`;

    constructor(private http: HttpClient) {
    }

    getUploaded(pageRequest: PageRequest): Observable<PagedResponse<Image>> {
        return this.http.get<PagedResponse<Image>>(`${this.IMAGE_SERVICE_API_URL}`, {
            params: {
                ...pageRequest,
            }
        });
    }

    uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('altText', file.name);

        return this.http.post<Image>(`${this.IMAGE_SERVICE_API_URL}/upload`, formData);
    }

    setAvatar(imageId: number) {
        return this.http.patch(`${this.IMAGE_SERVICE_API_URL}/${imageId}/set-avatar`, {});
    }

    deleteImage(imageId: number) {
        return this.http.delete(`${this.IMAGE_SERVICE_API_URL}/${imageId}`);
    }
}
