import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ImageUtils {

    constructor(private sanitizer: DomSanitizer) {
    }

    public createUrl(blob: Blob): string {
        return URL.createObjectURL(blob);
    }

    public createSafeUrl(blob: Blob): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.createUrl(blob));
    }
}