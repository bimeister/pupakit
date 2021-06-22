import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { getUuid, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable, of, Subscription, timer } from 'rxjs';
import { mapTo, startWith, switchMap, take } from 'rxjs/operators';
import { TreeManipulatorNew } from '../../../src/internal/declarations/classes/tree-manipulator-new.class';
import { TreeNewComponent } from '../../../src/lib/components/tree-new/components/tree-new/tree-new.component';
import { FlatTreeItem } from '../../../src/public-api';
import { RadioOption } from '../example-viewer/radio-option';

interface ComponentOutlet {
  componentClass: typeof TreeNewComponent;
  injector: Injector;
}

const DEFAULT_LENGTH: number = 10000;
const WOLF: FlatTreeItem = new FlatTreeItem(true, 'Wolves', null, getUuid(), { parentId: null });
const CAR: FlatTreeItem = new FlatTreeItem(true, 'Cars', null, getUuid(), { parentId: WOLF.id });
const BURGER: FlatTreeItem = new FlatTreeItem(true, 'Burgers', null, getUuid(), { parentId: null });
const HAPPY: FlatTreeItem = new FlatTreeItem(false, '😀', null, getUuid(), { parentId: null });

@Component({
  selector: 'demo-new-tree',
  styleUrls: ['./tree-new-demo.component.scss'],
  templateUrl: './tree-new-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class TreeNewDemoComponent implements OnDestroy {
  @ViewChild('loading') public readonly loading: Observable<boolean>;
  @ViewChild('dataLength') public readonly dataLength: Observable<number>;
  @ViewChild('timeOut') public readonly timeOut: Observable<number>;

  public manipulator: TreeManipulatorNew;
  public data: FlatTreeItem[];

  public readonly componentOutlet$: BehaviorSubject<Nullable<ComponentOutlet>> = new BehaviorSubject<
    Nullable<ComponentOutlet>
  >(null);
  public readonly dataLengthOptions: RadioOption[] = [
    { caption: '10к', value: DEFAULT_LENGTH },
    { caption: '100к', value: 100000 },
    { caption: '1кк', value: 1000000 }
  ];
  public readonly timeOutOptions: RadioOption[] = [
    { caption: '0 сек', value: 0 },
    { caption: '1 сек', value: 1000 },
    { caption: '3 сек', value: 3000 }
  ];
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly injector: Injector, private readonly changeDetectionRef: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.subscription.add(this.updateDataOnRadioChanges());
    this.setData(DEFAULT_LENGTH);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setData(count: number): void {
    this.data = this.getData(count);
    this.setNewInjector();
  }

  private setNewInjector(): void {
    this.manipulator = new TreeManipulatorNew({
      hideRoot: of(false),
      fetchChildrenFunction: (parentId: string) => this.fetch(parentId),
      isLoading: this.loading,
      scrollByRoute: of([WOLF.id, CAR.id, '1']),
      selectedNodesIds: of(['1']),
      hasDragAndDrop: of(true)
    });
    const componentOutlet: ComponentOutlet = {
      componentClass: TreeNewComponent,
      injector: Injector.create({
        providers: [{ provide: TreeManipulatorNew, useValue: this.manipulator }],
        parent: this.injector
      })
    };
    this.componentOutlet$.next(componentOutlet);
    this.changeDetectionRef.detectChanges();
  }

  private fetch(parentId: string): Observable<FlatTreeItem[]> {
    const children: FlatTreeItem[] = this.data.filter((item: FlatTreeItem) => item.originalData.parentId === parentId);
    return this.timeOut.pipe(
      startWith(0),
      switchMap((timeOut: number) => timer(timeOut)),
      take(1),
      mapTo(children)
    );
  }

  private getData(count: number = DEFAULT_LENGTH): FlatTreeItem[] {
    const childrenCount: number = 3;
    const leafElementsCount: number = Math.round(count / childrenCount);
    return [
      WOLF,
      CAR,
      BURGER,
      HAPPY,
      ...this.getChildren(WOLF.id, '🐺', leafElementsCount),
      ...this.getChildren(CAR.id, '🚗', leafElementsCount),
      new FlatTreeItem(false, `dfsfsdsfdsdf`, null, '1', { parentId: CAR.id }),
      ...this.getChildren(BURGER.id, '🍔', leafElementsCount)
    ];
  }

  private getChildren(parentId: string, name: string, leafElementsCount: number): FlatTreeItem[] {
    return new Array(leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `${name} ${index + 1}`, null, getUuid(), { parentId }));
  }

  private updateDataOnRadioChanges(): Subscription {
    return this.dataLength.subscribe((length: number) => {
      this.setData(length);
    });
  }
}
