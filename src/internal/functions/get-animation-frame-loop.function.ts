import { Observable, Subscriber } from 'rxjs';

export function getAnimationFrameLoop(): Observable<void> {
  return new Observable<void>((subscriber: Subscriber<void>) => {
    let breakLoop: boolean = false;

    const loop: Function = () => {
      if (breakLoop) {
        return;
      }
      requestAnimationFrame(() => {
        subscriber.next();
        loop();
      });
    };

    loop();
    return { unsubscribe: () => (breakLoop = true) };
  });
}
