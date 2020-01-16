import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, mapTo, take } from 'rxjs/operators';

import { VOID } from '../../constants/void.const';
import { DrawerFloat } from '../../core/components/drawer/drawer.component';

export interface LayoutDrawerConfiguration {
  enableOverlay?: boolean;
  clickableOverlay?: boolean;
  float?: DrawerFloat;
  zIndex?: number;
  closeButton?: boolean;
  withPadding?: boolean;
  destroyContentOnClose?: boolean;
  data?: Record<string, any>;
}

export interface ComponentDrawerData extends LayoutDrawerConfiguration {
  id: string;
  componentType: any;
  injector?: Injector;
}

@Injectable({
  providedIn: 'root'
})
export class DrawersService {
  public readonly componentDrawersData$: BehaviorSubject<Map<string, ComponentDrawerData>> = new BehaviorSubject<
    Map<string, ComponentDrawerData>
  >(new Map<string, ComponentDrawerData>());

  private readonly closeDrawerById$: Subject<string> = new Subject<string>();

  private readonly openDrawerById$: Subject<string> = new Subject<string>();

  private index: number = 0;

  private readonly defaultConfiguration: LayoutDrawerConfiguration = {
    enableOverlay: false,
    clickableOverlay: false,
    float: 'right',
    zIndex: 0,
    closeButton: false,
    withPadding: true,
    destroyContentOnClose: true,
    data: null
  };

  constructor(private readonly injector: Injector) {}

  public isOpen(componentDrawerId: string, isExpanded: boolean): Observable<void> {
    return this.openDrawerById$.pipe(
      filter((drawerId: string) => drawerId === componentDrawerId && isExpanded),
      mapTo(VOID)
    );
  }

  public isClosed(componentDrawerId: string, isExpanded: boolean): Observable<void> {
    return this.closeDrawerById$.pipe(
      filter((drawerId: string) => drawerId === componentDrawerId && isExpanded),
      mapTo(VOID)
    );
  }

  public create(componentType: any, configuration?: LayoutDrawerConfiguration): Observable<string> {
    return this.componentDrawersData$.pipe(
      take(1),
      map((collection: Map<string, ComponentDrawerData>) => {
        const id: string = this.createNewId();
        const newConfiguration: LayoutDrawerConfiguration = { ...this.defaultConfiguration, ...configuration };
        const injector: Injector = Injector.create({
          providers: [
            { provide: 'drawerId', useValue: id },
            { provide: 'data', useValue: newConfiguration.data }
          ],
          parent: this.injector
        });
        const drawerData: ComponentDrawerData = {
          ...newConfiguration,
          id,
          componentType,
          injector
        };
        collection.set(drawerData.id, drawerData);
        this.componentDrawersData$.next(collection);
        return id;
      })
    );
  }

  public closeDrawerById(drawerId: string): void {
    this.closeDrawerById$.next(drawerId);
  }

  public openDrawerById(drawerId: string): void {
    this.openDrawerById$.next(drawerId);
  }

  public destroyDrawerById(drawerId: string): void {
    this.componentDrawersData$.pipe(take(1)).subscribe((collection: Map<string, ComponentDrawerData>) => {
      collection.delete(drawerId);
      this.componentDrawersData$.next(collection);
    });
  }

  private createNewId(): string {
    return `drawer-id-${this.index++}-${new Date().getTime()}`;
  }
}
