import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { getUuid } from '@meistersoft/utilities';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { FlatTreeItem } from '../../../src/internal/declarations/classes/flat-tree-item.class';

const leafElementsCount: number = 1000;

@Component({
  selector: 'demo-select',
  styleUrls: ['../demo.scss', './select-demo.component.scss'],
  templateUrl: './select-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDemoComponent {
  public readonly formControl: FormControl = new FormControl({ value: [], disabled: false });
  public readonly invalidFormControl: FormControl = new FormControl({ value: 1, disabled: false }, [
    Validators.requiredTrue
  ]);
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public readonly treeDataOrigin: FlatTreeItem[] = [
    new FlatTreeItem(true, 'Wolves', 0, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `🐺 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Cars', 0, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `🚗 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Burgers', 0, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `🍔 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Faces', 0, null, null, false),
    new FlatTreeItem(true, 'Happy', 1, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `😀 ${index + 1}`, 2, null, null, true)),
    new FlatTreeItem(true, 'Sad', 1, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `😥 ${index + 1}`, 2, null, null, true)),
    new FlatTreeItem(false, '🐵', 1, null, null, true),
    new FlatTreeItem(false, '🙊', 1, null, null, true),
    new FlatTreeItem(false, '🙉', 1, null, null, true),
    new FlatTreeItem(false, '🙈', 1, null, null, true)
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
            { children: [], childrenCount: 0, description: '3', name: 'sample 1 1 3', id: null, roles: [] }
          ],
          childrenCount: 3,
          description: '4',
          name: 'sample 1 1',
          id: null,
          roles: []
        },
        { children: [], childrenCount: 0, description: '5', name: 'sample 1 2', id: null, roles: [] },
        { children: [], childrenCount: 0, description: '6', name: 'sample 1 3', id: null, roles: [] },
        { children: [], childrenCount: 0, description: '7', name: 'sample 1 4', id: null, roles: [] }
      ],
      childrenCount: 4,
      description: '8',
      name: 'sample 1',
      id: null,
      roles: []
    },
    { children: [], childrenCount: 0, description: '9', name: 'sample 2', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 3', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 4', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 5', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 6', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 7', id: null, roles: [] },
    { children: [], childrenCount: 0, description: '', name: 'sample 8', id: null, roles: [] }
  ];

  public itemsWithoutCaptionNested: any[] = [
    {
      data: {
        children: [],
        childrenCount: 0,
        description: '',
        name: 'sample 1',
        id: null,
        roles: []
      }
    },
    {
      data: {
        children: [],
        childrenCount: 0,
        description: '',
        name: 'sample 2',
        id: null,
        roles: []
      }
    },
    {
      data: {
        children: [],
        childrenCount: 0,
        description: '',
        name: 'sample 3',
        id: null,
        roles: []
      }
    }
  ];

  constructor() {
    /* tslint:disable */
    this.formControl.valueChanges.subscribe(console.log);
    /* tslint:enable */
  }

  public toggleLoader(): void {
    this.isLoading$.pipe(take(1)).subscribe((isLoading: boolean) => {
      this.isLoading$.next(!isLoading);
    });
  }

  public log(...data: any[]): void {
    // tslint:disable-next-line: no-console
    console.log(...data);
  }
}
