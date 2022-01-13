import { Observable } from 'rxjs';

type ObservableNextCallbackType<T extends Observable<unknown>> = Parameters<T['subscribe']>[0];
export type ObservableValueType<T extends Observable<unknown>> = Parameters<ObservableNextCallbackType<T>>[0];
