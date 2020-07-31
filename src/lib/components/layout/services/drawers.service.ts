import { ComponentFactory, Injectable, Injector } from '@angular/core';
import { mapToVoid } from '@meistersoft/utilities';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ComponentDrawerData } from '../../../../internal/declarations/interfaces/component-drawer-data.interface';
import {
  LayoutDrawerConfiguration,
} from '../../../../internal/declarations/interfaces/layout-drawer-configuration.interface';

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
      mapToVoid()
    );
  }

  public isClosed(componentDrawerId: string, isExpanded: boolean): Observable<void> {
    return this.closeDrawerById$.pipe(
      filter((drawerId: string) => drawerId === componentDrawerId && isExpanded),
      mapToVoid()
    );
  }

  public create(
    componentFactory: ComponentFactory<any>,
    configuration?: LayoutDrawerConfiguration
  ): Observable<string> {
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
          componentFactory,
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
