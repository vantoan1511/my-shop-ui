import {catchError, map, Observable, of, OperatorFunction, scan, startWith, switchMap} from "rxjs";
import {LoadingState} from "../shared/model/loading-state";

export function switchMapWithLoading<T>(observableFunction: (value: any) => Observable<T>): OperatorFunction<any, LoadingState<T>> {
    return (source: Observable<any>) =>
        source.pipe(
            switchMap((value) =>
                observableFunction(value).pipe(
                    map((data) => ({data, loading: false} as LoadingState<T>)),
                    catchError((error) => of({error, loading: false} as LoadingState<T>)),
                    startWith({error: null, loading: true} as LoadingState<T>),
                )
            ),
            scan((state: LoadingState<T>, change: LoadingState<T>) => ({...state, ...change}))
        )
}