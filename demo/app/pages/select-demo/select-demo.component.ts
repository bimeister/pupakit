import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { getUuid, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { FlatTreeItem } from '../../../../src/public-api';

const leafElementsCount: number = 1000;

interface SelectOption {
  value: number;
  caption: string;
}

const BASE_REQUEST_PATH: string = 'select-demo/examples';

@Component({
  selector: 'demo-select',
  styleUrls: ['./select-demo.component.scss'],
  templateUrl: './select-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`
  };

  public readonly chipsFormControl: FormControl = new FormControl({ value: [], disabled: false });

  public readonly control: FormControl = new FormControl({ value: null, disabled: false });
  public readonly options: SelectOption[] = [
    { value: 1, caption: 'Отчет 1' },
    { value: 2, caption: 'Отчет 2' },
    { value: 3, caption: 'Отчет 3' },
    { value: 4, caption: 'Отчет 4' },
    { value: 5, caption: 'Отчет 5' },
  ];
  public readonly selectedValuePreview$: Observable<string> = this.control.valueChanges.pipe(
    startWith(this.control.value),
    map((controlValue: number) => this.options.find((option: SelectOption) => option.value === controlValue)),
    map((selectedOption: SelectOption) => (isNil(selectedOption) ? '' : selectedOption.caption))
  );

  public readonly formControl: FormControl = new FormControl({ value: [], disabled: false });
  public readonly invalidFormControl: FormControl = new FormControl({ value: 1, disabled: false }, [
    Validators.requiredTrue,
  ]);
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public readonly treeDataOrigin: FlatTreeItem[] = [
    new FlatTreeItem(true, 'Wolves', 0, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `🐺 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Cars', 0, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `🚗 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Burgers', 0, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `🍔 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Faces', 0, null, null, false),
    new FlatTreeItem(true, 'Happy', 1, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `😀 ${index + 1}`, 2, null, null, true)),
    new FlatTreeItem(true, 'Sad', 1, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `😥 ${index + 1}`, 2, null, null, true)),
    new FlatTreeItem(false, '🐵', 1, null, null, true),
    new FlatTreeItem(false, '🙊', 1, null, null, true),
    new FlatTreeItem(false, '🙉', 1, null, null, true),
    new FlatTreeItem(false, '🙈', 1, null, null, true),
  ].map((item: FlatTreeItem) => ({ ...item, id: getUuid() }));

  public lorems: string[] = `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  Beatae cum cupiditate eos ex facilis, fuga fugiat modi natus nisi obcaecati possimus reprehenderit.
  Animi deleniti illo modi officia rem sapiente! Sint!`.split(' ');

  public icons: string[] = ['airplane', 'add', 'arrow-forward'];

  public itemsWithoutCaption: any[] = [
    {
      children: [
        {
          children: [
            { children: [], childrenCount: 0, description: '1', name: 'sample 1 1 1', id: null, roles: [] },
            { children: [], childrenCount: 0, description: '2', name: 'sample 1 1 2', id: null, roles: [] },
            { children: [], childrenCount: 0, description: '3', name: 'sample 1 1 3', id: null, roles: [] },
          ],
          childrenCount: 3,
          description: '4',
          name: 'sample 1 1',
          id: null,
          roles: [],
        },
        { children: [], childrenCount: 0, description: '5', name: 'sample 1 2', id: null, roles: [] },
        { children: [], childrenCount: 0, description: '6', name: 'sample 1 3', id: null, roles: [] },
        { children: [], childrenCount: 0, description: '7', name: 'sample 1 4', id: null, roles: [] },
      ],
      childrenCount: 4,
      description: '8',
      name: 'sample 1',
      id: null,
      roles: [],
    },
    { children: [], childrenCount: 0, description: '9', name: 'sample 2', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 3', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 4', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 5', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 6', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 7', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 8', id: null, roles: [] },
  ];

  public tabItems: any[] = new Array(10).fill(null).map((_value: null, index: number) => ({
    value: index,
    caption: `Значение ${index}`,
  }));

  public itemsWithoutCaptionNested: any[] = [
    {
      data: {
        children: [],
        childrenCount: 0,
        description: '',
        name: 'sample 1',
        id: null,
        roles: [],
      },
    },
    {
      data: {
        children: [],
        childrenCount: 0,
        description: '',
        name: 'sample 2',
        id: null,
        roles: [],
      },
    },
    {
      data: {
        children: [],
        childrenCount: 0,
        description: '',
        name: 'sample 3',
        id: null,
        roles: [],
      },
    },
  ];

  constructor() {
    /* eslint-disable */
    this.formControl.valueChanges.subscribe(console.log);
    this.chipsFormControl.valueChanges.subscribe(console.log);
    /* eslint-enable */
  }

  public toggleLoader(): void {
    this.isLoading$.pipe(take(1)).subscribe((isLoading: boolean) => {
      this.isLoading$.next(!isLoading);
    });
  }

  public processTabsSelect(event: any): void {
    // eslint-disable-next-line no-console
    console.log(event);
  }

  public log(...data: any[]): void {
    // eslint-disable-next-line no-console
    console.log(...data);
  }
}
