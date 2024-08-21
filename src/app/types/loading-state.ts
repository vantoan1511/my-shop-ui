export interface LoadingState<T = unknown> {
    data: T;
    loading: boolean;
    error?: Error | null;
}