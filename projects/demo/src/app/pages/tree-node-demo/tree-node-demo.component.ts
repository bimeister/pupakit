import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

const BASE_REQUEST_PATH: string = 'tree-node-demo/examples';

@Component({
  selector: 'pupa-tree-node-demo',
  templateUrl: './tree-node-demo.component.html',
  styleUrls: ['./tree-node-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeDemoComponent {
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

  public readonly treeNodePropertiesForm: FormGroup = new FormGroup({
    level: new FormControl(0),
    isDirectory: new FormControl(false),
    isLoading: new FormControl(false),
    hasChildren: new FormControl(false),
    isExpanded: new FormControl(false),
    isSelected: new FormControl(false),
    isHighlighted: new FormControl(false),
    isDisabled: new FormControl(false),
    forceHover: new FormControl(false),
  });
}
