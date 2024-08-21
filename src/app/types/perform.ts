import {catchError, Observable, take} from "rxjs";

export class Perform<T> {
    data: T | undefined;
    loading = false;
    hasError = false;
    private action$: Observable<T> | undefined;

    load(action$: Observable<T>) {
        this.loading = true;
        this.action$ = action$;
        this.action$.pipe(
            take(1),
            catchError(() => {
                this.data = undefined;
                this.loading = false;
                this.hasError = true;
                return [];
            })
        )
            .subscribe((data: T) => {
                this.data = data;
                this.loading = false;
                this.hasError = false;
            })
    }
}