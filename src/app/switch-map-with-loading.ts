import {
  catchError,
  map,
  Observable,
  of,
  OperatorFunction,
  scan,
  startWith,
  switchMap,
} from 'rxjs';
import { LoadingState } from './types/loading-state';

export function switchMapWithLoading<T>(
  observableFunction: (value: Object) => Observable<T>
): OperatorFunction<Object, LoadingState<T>> {
  return (source: Observable<Object>) =>
    source.pipe(
      switchMap((value) =>
        observableFunction(value).pipe(
          map((data) => ({ data, loading: false } as LoadingState<T>)),
          catchError((error) =>
            of({ error, loading: false } as LoadingState<T>)
          ),
          startWith({ error: null, loading: true } as LoadingState<T>)
        )
      ),
      scan((state: LoadingState<T>, change: LoadingState<T>) => ({
        ...state,
        ...change,
      }))
    );
}
