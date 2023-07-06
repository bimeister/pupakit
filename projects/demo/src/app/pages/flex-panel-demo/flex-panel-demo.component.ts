import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';
import { FlatTreeItem, TreeController, TreeEvents } from '@bimeister/pupakit.tree';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { DATA } from '../tree-new-demo/examples/example-tree.data';
import { map } from 'rxjs/operators';

const BASE_REQUEST_PATH: string = 'flex-panel-demo/examples';

@Component({
  selector: 'demo-card',
  templateUrl: './flex-panel-demo.component.html',
  styleUrls: ['./flex-panel-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexPanelDemoComponent implements OnDestroy {
  public readonly handlerMaxSizeReached$: Subject<any> = new Subject<any>();
  public readonly handlerMinSizeReached$: Subject<any> = new Subject<any>();
  public readonly handleSizeChanged$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public readonly controller: TreeController = new TreeController();
  private readonly subscription: Subscription = new Subscription();

  private readonly emitted: Subject<boolean> = new Subject<boolean>();
  public emitted$: Observable<boolean> = this.emitted.asObservable();

  private readonly currentSize: Subject<number> = new Subject<number>();
  public currentSize$: Observable<string> = this.currentSize.pipe(map((size: number) => `${size}px`));

  public readonly resizableControl: FormControl = new FormControl(true);
  public readonly thresholdVwControl: FormControl = new FormControl(200);
  public readonly resizableOptions: PropsOption[] = [
    {
      caption: '100px',
      value: '100px',
    },
    {
      caption: '100',
      value: 100,
      isDefault: true,
    },
    {
      caption: '10%',
      value: '10%',
    },
  ];

  public readonly thresholdVwOptions: PropsOption[] = [
    {
      caption: '5',
      value: 5,
    },
    {
      caption: '10',
      value: 10,
      isDefault: true,
    },
    {
      caption: '15',
      value: 15,
    },
  ];

  public readonly expandedFormControl: FormControl = new FormControl(false);

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  constructor() {
    this.initController();
    this.subscription.add(this.setChildrenOnExpand());
    this.subscription.add(this.removeChildrenOnCollapse());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public initController(): void {
    this.controller.setChildren(null, this.fetch());
  }

  public showThresholdReached(): void {
    this.emitted.next(true);
  }

  public sizeChanged(size: number): void {
    this.currentSize.next(size);
  }

  private setChildrenOnExpand(): Subscription {
    return this.controller
      .getEvents(TreeEvents.Expand)
      .subscribe((event: TreeEvents.Expand) =>
        this.controller.setChildren(event.payload.id, this.fetch(event.payload.id))
      );
  }

  private removeChildrenOnCollapse(): Subscription {
    return this.controller
      .getEvents(TreeEvents.Collapse)
      .subscribe((event: TreeEvents.Collapse) => this.controller.removeChildren(event.payload));
  }

  private fetch(parentId: string = null): FlatTreeItem[] {
    const children: FlatTreeItem[] = DATA.filter((item: FlatTreeItem) => item.originalData.parentId === parentId);
    return children;
  }

  public handlerMaxSizeReached(): void {
    this.handlerMaxSizeReached$.next(true);
    this.handlerMinSizeReached$.next(false);
  }

  public handlerMinSizeReached(): void {
    this.handlerMaxSizeReached$.next(false);
    this.handlerMinSizeReached$.next(true);
  }

  public handleSizeChanged(size: number): void {
    this.handleSizeChanged$.next(size);
  }
}
