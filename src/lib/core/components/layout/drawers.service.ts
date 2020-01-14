import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

export type DrawerFloat = 'left' | 'right';

export interface LayoutDrawerConfiguration {
  enableOverlay?: boolean;
  clickableOverlay?: boolean;
  float?: DrawerFloat;
  zIndex?: number;
  closeButton?: boolean;
  canPadding?: boolean;
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

  public readonly closeDrawerById$: Subject<string> = new Subject<string>();

  public readonly openDrawerById$: Subject<string> = new Subject<string>();

  private index: number = 0;

  private readonly defaultConfiguration: LayoutDrawerConfiguration = {
    enableOverlay: false,
    clickableOverlay: false,
    float: 'right',
    zIndex: 0,
    closeButton: false,
    canPadding: true,
    destroyContentOnClose: true,
    data: null
  };

  constructor(private readonly injector: Injector) {}

  public create(componentType: any, configuration?: LayoutDrawerConfiguration): Observable<string> {
    return this.componentDrawersData$.pipe(
      take(1),
      map((collection: Map<string, ComponentDrawerData>) => {
        const id: string = this.createNewId();
        const newConfiguration: LayoutDrawerConfiguration = { ...this.defaultConfiguration, ...configuration };
        const injector: Injector = Injector.create({
          providers: [
            { provide: 'drawerId', useValue: id },
            { provide: 'data', useValue: configuration.data }
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
