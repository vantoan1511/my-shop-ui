import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {constant} from "../constant";

@Injectable({
  providedIn: "root",
})
export class ImageUtils {

  createImageUrl(imageId?: number) {
    if (imageId) {
      return `${environment.IMAGE_SERVICE_API}/images/${imageId}`;
    }
    return constant.defaultHeroImageUrl;
  }
}
