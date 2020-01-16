import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export type ModalWindowSize = 'large' | 'medium' | 'small';

export interface ModalWindowConfiguration {
  icon?: string;
  colorIcon?: string;
  title?: string;
  size?: ModalWindowSize;
  enableOverlay?: boolean;
  clickableOverlay?: boolean;
  zIndex?: number;
  closeButton?: boolean;
  data?: Record<string, any>;
  canMove?: boolean;
  canPadding?: boolean;
}

export interface ModalWindowData extends ModalWindowConfiguration {
  id: string;
  componentType: any;
  injector?: Injector;
}

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

  constructor(private readonly injector: Injector) {}

  public create(componentType: any, configuration?: ModalWindowConfiguration): Observable<string> {
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
          componentType,
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
    });
  }

  private createNewId(): string {
    return `modal-window-id-${this.index++}-${new Date().getTime()}`;
  }
}
