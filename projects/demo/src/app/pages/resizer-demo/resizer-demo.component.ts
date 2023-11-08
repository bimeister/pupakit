import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ResizerCurrentSize } from '@bimeister/pupakit.kit/declarations/interfaces/resizer-current-size.interface';
import { FlatTreeItem, TreeController, TreeEvents } from '@bimeister/pupakit.tree';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';
import { DATA } from '../tree-new-demo/examples/example-tree.data';

const BASE_REQUEST_PATH: string = 'resizer-demo/examples';

@Component({
  selector: 'demo-card',
  templateUrl: './resizer-demo.component.html',
  styleUrls: ['./resizer-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizerDemoComponent implements OnDestroy {
  public readonly paddingsPxFormControl: FormControl<number> = new FormControl<number>(0);
  public readonly handlerMaxSizeReached$: Subject<boolean> = new Subject<boolean>();
  public readonly handlerMinSizeReached$: Subject<boolean> = new Subject<boolean>();
  public readonly sizePx$: Subject<number> = new Subject<number>();
  public readonly sizePercent$: Subject<string> = new Subject<string>();

  public readonly controller: TreeController = new TreeController();
  private readonly subscription: Subscription = new Subscription();

  private readonly emittedState$: Subject<boolean> = new Subject<boolean>();
  public readonly emitted$: Observable<boolean> = this.emittedState$.asObservable();

  private readonly currentSizeState$: Subject<number> = new Subject<number>();
  public readonly currentSize$: Observable<string> = this.currentSizeState$.pipe(map((size: number) => `${size}px`));

  public readonly resizableControl: FormControl<boolean> = new FormControl<boolean>(true);
  public readonly thresholdVwControl: FormControl<number> = new FormControl<number>(200);
  public readonly defaultSizeOptions: PropsOption[] = [
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
  public readonly initialSizeOptions: PropsOption[] = [
    {
      caption: '150px',
      value: '150px',
    },
    {
      caption: '150',
      value: 150,
      isDefault: true,
    },
    {
      caption: '10%',
      value: '10%',
    },
  ];
  public readonly resizableMaxOptions: PropsOption[] = [
    {
      caption: '200px',
      value: '200px',
    },
    {
      caption: '200',
      value: 200,
      isDefault: true,
    },
    {
      caption: '20%',
      value: '20%',
    },
  ];
  public readonly resizableMinOptions: PropsOption[] = [
    {
      caption: '50px',
      value: '50px',
    },
    {
      caption: '50',
      value: 50,
      isDefault: true,
    },
    {
      caption: '5%',
      value: '5%',
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

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-3/example-3.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/example-3.component.scss`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-4/example-4.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/example-4.component.scss`,
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
    this.controller.addChildren(null, this.fetch());
  }

  public showThresholdReached(): void {
    this.emittedState$.next(true);
  }

  public sizeChanged(size: number): void {
    this.currentSizeState$.next(size);
  }

  public handlerMaxSizeReached(): void {
    this.handlerMaxSizeReached$.next(true);
    this.handlerMinSizeReached$.next(false);
  }

  public handlerMinSizeReached(): void {
    this.handlerMaxSizeReached$.next(false);
    this.handlerMinSizeReached$.next(true);
  }

  public handleSizeChanged(size: ResizerCurrentSize): void {
    this.sizePx$.next(size.px);
    this.sizePercent$.next(size.percent);
  }

  private setChildrenOnExpand(): Subscription {
    return this.controller
      .getEvents(TreeEvents.Expand)
      .subscribe((event: TreeEvents.Expand) =>
        this.controller.addChildren(event.payload.id, this.fetch(event.payload.id))
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
}
