import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { treeControllerDeclarationsData } from './data/tree-controller-declarations.data';
import { treeControllerOptionsDeclarationsData } from './data/tree-controller-options-declarations.data';
import { flatTreeItemDeclarationsData } from './data/flat-tree-item-declarations.data';
import { treeDataDisplayCollectionRefDeclarationsData } from './data/tree-data-display-collection-ref-declarations.data';

const BASE_REQUEST_PATH: string = 'tree-new-demo/examples';

@Component({
  selector: 'demo-new-tree',
  styleUrls: ['./tree-new-demo.component.scss'],
  templateUrl: './tree-new-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TreeNewDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/tree-new-example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/tree-new-example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-1/tree-new-example-1.component.ts`,
    DATA: `${BASE_REQUEST_PATH}/example-tree.data.ts`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/tree-new-example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/tree-new-example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-2/tree-new-example-2.component.ts`,
    DATA: `${BASE_REQUEST_PATH}/example-tree.data.ts`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/tree-new-example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/tree-new-example-3.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-3/tree-new-example-3.component.ts`,
    DATA: `${BASE_REQUEST_PATH}/example-tree.data.ts`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/tree-new-example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/tree-new-example-4.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-4/tree-new-example-4.component.ts`,
    DATA: `${BASE_REQUEST_PATH}/example-tree.data.ts`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-5/tree-new-example-5.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-5/tree-new-example-5.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-5/tree-new-example-5.component.ts`,
    DATA: `${BASE_REQUEST_PATH}/example-tree.data.ts`,
  };

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-6/tree-new-example-6.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-6/tree-new-example-6.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-6/tree-new-example-6.component.ts`,
    DATA: `${BASE_REQUEST_PATH}/example-tree.data.ts`,
  };

  public readonly example7Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-7/tree-new-example-7.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-7/tree-new-example-7.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-7/tree-new-example-7.component.ts`,
    DATA: `${BASE_REQUEST_PATH}/example-tree-for-scroll-demo.data.ts`,
  };

  public readonly example8Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-8/tree-new-example-8.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-8/tree-new-example-8.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-8/tree-new-example-8.component.ts`,
    DATA: `${BASE_REQUEST_PATH}/example-tree.data.ts`,
  };

  public readonly treeControllerDeclarationsData: string = treeControllerDeclarationsData;
  public readonly treeControllerOptionsDeclarationsData: string = treeControllerOptionsDeclarationsData;
  public readonly flatTreeItemDeclarationsData: string = flatTreeItemDeclarationsData;
  public readonly treeDataDisplayCollectionRefDeclarationsData: string = treeDataDisplayCollectionRefDeclarationsData;
}
