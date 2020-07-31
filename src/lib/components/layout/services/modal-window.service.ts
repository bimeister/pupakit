import { ComponentFactory, Injectable, Injector } from '@angular/core';
import { mapToVoid } from '@meistersoft/utilities';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ModalWindowConfiguration } from '../../../../internal/declarations/interfaces/modal-window-configuration.interface';
import { ModalWindowData } from '../../../../internal/declarations/interfaces/modal-window-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalWindowService {
  public readonly modalWindowsData$: BehaviorSubject<Map<string, ModalWindowData>> = new BehaviorSubject<
    Map<string, ModalWindowData>
  >(new Map<string, ModalWindowData>());

  private index: number = 0;

  private readonly defaultConfiguration: ModalWindowConfiguration = {
    icon: null,
    colorIcon: null,
    title: null,
    size: 'medium',
    enableOverlay: true,
    clickableOverlay: true,
    zIndex: 0,
    closeButton: false,
    data: null,
    canMove: false,
    canPadding: true
  };

  private readonly close$: Subject<string> = new Subject<string>();

  constructor(private readonly injector: Injector) {}

  public close(windowId: string): Observable<void> {
    return this.close$.pipe(
      filter((modalWindowId: string) => modalWindowId === windowId),
      take(1),
      mapToVoid()
    );
  }

  public create(componentFactory: ComponentFactory<any>, configuration?: ModalWindowConfiguration): Observable<string> {
    return this.modalWindowsData$.pipe(
      take(1),
      map((collection: Map<string, ModalWindowData>) => {
        const id: string = this.createNewId();
        const newConfiguration: ModalWindowConfiguration = { ...this.defaultConfiguration, ...configuration };
        const injector: Injector = Injector.create({
          providers: [
            { provide: 'modalWindowId', useValue: id },
            { provide: 'data', useValue: newConfiguration.data }
          ],
          parent: this.injector
        });
        const drawerData: ModalWindowData = {
          ...newConfiguration,
          id,
          componentFactory,
          injector
        };
        collection.set(drawerData.id, drawerData);
        this.modalWindowsData$.next(collection);
        return id;
      })
    );
  }

  public closeModalWindowById(modalWindowId: string): void {
    this.modalWindowsData$.pipe(take(1)).subscribe((collection: Map<string, ModalWindowData>) => {
      collection.delete(modalWindowId);
      this.modalWindowsData$.next(collection);
      this.close$.next(modalWindowId);
    });
  }

  private createNewId(): string {
    return `modal-window-id-${this.index++}-${new Date().getTime()}`;
  }
}
