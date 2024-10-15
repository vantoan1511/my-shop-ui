import {HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, take} from 'rxjs';

export class Perform<T> {
    data: T | undefined;
    isLoading = false;
    error: HttpErrorResponse | null = null;
    private action$: Observable<T> | undefined;

    load(action$: Observable<T>): void {
        this.isLoading = true;
        this.action$ = action$;
        this.action$
            .pipe(
                take(1),
                catchError((error) => {
                    this.data = undefined;
                    this.isLoading = false;
                    this.error = error;
                    return [];
                })
            )
            .subscribe((data: T) => {
                this.data = data;
                this.isLoading = false;
                this.error = null;
            });
    }
}
