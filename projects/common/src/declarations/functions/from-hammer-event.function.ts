import { Observable, Subscriber } from 'rxjs';

export function fromHammerEvent(hammerManager: HammerManager, events: string[]): Observable<HammerInput> {
  return new Observable<HammerInput>((subscriber: Subscriber<HammerInput>) => {
    hammerManager.on(events.join(' '), (event: HammerInput) => {
      subscriber.next(event);
    });

    return { unsubscribe: () => hammerManager.destroy() };
  });
}
