import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FlatTreeItem } from '@bimeister/pupakit.tree';
import { getUuid } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'select-demo/examples';

const LEAF_ELEMENTS_COUNT: number = 10;

@Component({
  selector: 'demo-select',
  styleUrls: ['./select-demo.component.scss'],
  templateUrl: './select-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDemoComponent implements OnInit, OnDestroy {
  public readonly control1: FormControl = new FormControl([]);
  public readonly control2: FormControl = new FormControl([]);
  public readonly validators: ValidatorFn[] = [Validators.required];

  public readonly isDisabledControl: FormControl = new FormControl();
  public readonly controlsList: FormControl[] = [this.control1, this.control2];
  private readonly disabled$: Observable<boolean> = this.isDisabledControl.statusChanges.pipe(
    map(() => this.isDisabledControl.disabled)
  );

  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'Large',
      value: 'large',
    },
    {
      caption: 'Medium',
      value: 'medium',
      isDefault: true,
    },
  ];

  private readonly subscription: Subscription = new Subscription();
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly treeDataOrigin: FlatTreeItem[] = [
    new FlatTreeItem(true, 'Wolves', 0, null, null, false),
    ...new Array(LEAF_ELEMENTS_COUNT)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `🐺 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Cars', 0, null, null, false),
    ...new Array(LEAF_ELEMENTS_COUNT)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `🚗 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Burgers', 0, null, null, false),
    ...new Array(LEAF_ELEMENTS_COUNT)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `🍔 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Faces', 0, null, null, false),
    new FlatTreeItem(true, 'Happy', 1, null, null, false),
    ...new Array(LEAF_ELEMENTS_COUNT)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `😀 ${index + 1}`, 2, null, null, true)),
    new FlatTreeItem(true, 'Sad', 1, null, null, false),
    ...new Array(LEAF_ELEMENTS_COUNT)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `😥 ${index + 1}`, 2, null, null, true)),
    new FlatTreeItem(false, '🐵', 1, null, null, true),
    new FlatTreeItem(false, '🙊', 1, null, null, true),
    new FlatTreeItem(false, '🙉', 1, null, null, true),
    new FlatTreeItem(false, '🙈', 1, null, null, true),
  ].map((item: FlatTreeItem) => ({ ...item, id: getUuid() }));

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-1/example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-1/example-1.component.ts`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-2/example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-2/example-2.component.ts`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-3/example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-3/example-3.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-3/example-3.component.ts`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-4/example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-4/example-4.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-4/example-4.component.ts`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-5/example-5.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-5/example-5.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-5/example-5.component.ts`,
  };

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-6/example-6.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-6/example-6.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-6/example-6.component.ts`,
  };

  public readonly example7Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-7/example-7.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-7/example-7.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-7/example-7.component.ts`,
  };

  public readonly example8Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-8/example-8.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-8/example-8.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-8/example-8.component.ts`,
  };

  public readonly example9Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-9/example-9.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-9/example-9.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-9/example-9.component.ts`,
  };

  public readonly example10Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-10/example-10.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-10/example-10.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-10/example-10.component.ts`,
  };

  public readonly example11Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-structure-composition/example-11/example-11.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-structure-composition/example-11/example-11.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-structure-composition/example-11/example-11.component.ts`,
  };

  public readonly example12Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-12/example-12.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-12/example-12.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-12/example-12.component.ts`,
  };

  public readonly example13Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-13/example-13.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-13/example-13.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-13/example-13.component.ts`,
  };

  public readonly example16Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-other/example-16/example-16.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-other/example-16/example-16.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-other/example-16/example-16.component.ts`,
  };

  public readonly example17Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-other/example-17/example-17.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-other/example-17/example-17.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-other/example-17/example-17.component.ts`,
  };

  public readonly example18Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-18/example-18.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-18/example-18.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-18/example-18.component.ts`,
  };

  public readonly example19Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-other/example-19/example-19.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-other/example-19/example-19.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-other/example-19/example-19.component.ts`,
  };

  public readonly example20Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-other/example-20/example-20.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-other/example-20/example-20.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-other/example-20/example-20.component.ts`,
  };

  public ngOnInit(): void {
    this.subscription.add(this.subscribeToDisabled());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public toggleLoader(): void {
    this.isLoading$.pipe(take(1)).subscribe((isLoading: boolean) => {
      this.isLoading$.next(!isLoading);
    });
  }

  private subscribeToDisabled(): Subscription {
    return this.disabled$.subscribe((isDisabled: boolean) => {
      this.controlsList.forEach((control: FormControl) => (isDisabled ? control.disable() : control.enable()));
    });
  }
}
