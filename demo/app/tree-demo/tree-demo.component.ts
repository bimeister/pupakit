import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FlatTreeManipulator } from 'src/internal/declarations/classes/flat-tree-manipulator.class';
import { TreeManipulator } from 'src/internal/declarations/classes/tree-manipulator.class';

import { FlatTreeItem } from './../../../src/internal';
import { flatSource } from './flat-source.const';

@Component({
  selector: 'demo-tree-demo',
  templateUrl: './tree-demo.component.html',
  styleUrls: ['./tree-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeDemoComponent {
  public isFlatTreeUsed: boolean = false;

  public readonly depthControl: FormControl = new FormControl(1);
  // tslint:disable-next-line: no-magic-numbers
  public readonly sizeControl: FormControl = new FormControl(10);

  private readonly flatSource$: Observable<FlatTreeItem[]> = of(flatSource);

  public readonly flatTreeConfiguration: TreeManipulator = new FlatTreeManipulator({
    dataOrigin$: this.flatSource$,
    scrollByRoute$: of([]),
    selectedNodesIds$: of(null),
    nodeTemplate: null,
    trackBy: null
  });
}
