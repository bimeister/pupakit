import { storiesOf } from '@storybook/angular';
import { of } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { FlatTreeItem } from '../../../internal/declarations/classes/flat-tree-item.class';
import { FlatTreeManipulator } from '../../../internal/declarations/classes/flat-tree-manipulator.class';
import { Uuid } from '../../../internal/declarations/types/uuid.type';
import { TreeModule } from './tree.module';

const leafElementsCount: number = 100;
const flatTreeConfiguration: FlatTreeManipulator = new FlatTreeManipulator({
  dataOrigin$: of(
    [
      new FlatTreeItem(true, 'Wolves', 0, null),
      ...new Array(leafElementsCount)
        .fill(null)
        .map((_, index: number) => new FlatTreeItem(false, `🐺 ${index + 1}`, 1, null)),
      new FlatTreeItem(true, 'Cars', 0, null),
      ...new Array(leafElementsCount)
        .fill(null)
        .map((_, index: number) => new FlatTreeItem(false, `🚗 ${index + 1}`, 1, null)),
      new FlatTreeItem(true, 'Burgers', 0, null),
      ...new Array(leafElementsCount)
        .fill(null)
        .map((_, index: number) => new FlatTreeItem(false, `🍔 ${index + 1}`, 1, null)),
      new FlatTreeItem(true, 'Faces', 0, null),
      new FlatTreeItem(true, 'Happy', 1, null),
      ...new Array(leafElementsCount)
        .fill(null)
        // tslint:disable-next-line: no-magic-numbers
        .map((_, index: number) => new FlatTreeItem(false, `😀 ${index + 1}`, 2, null)),
      new FlatTreeItem(true, 'Sad', 1, null),
      ...new Array(leafElementsCount)
        .fill(null)
        // tslint:disable-next-line: no-magic-numbers
        .map((_, index: number) => new FlatTreeItem(false, `😥 ${index + 1}`, 2, null)),
      new FlatTreeItem(false, '🐵', 1, null),
      new FlatTreeItem(false, '🙊', 1, null),
      new FlatTreeItem(false, '🙉', 1, null),
      new FlatTreeItem(false, '🙈', 1, null)
    ].map((item: FlatTreeItem) => ({ ...item, id: uuid() }))
  ),
  selectedNodesIds$: of([]),
  scrollByRoute$: of([]),
  nodeTemplate: null,
  elementTemplate: null,
  trackBy: (_, item: FlatTreeItem): Uuid => item.id
});

storiesOf('Tree', module).add('default', () => ({
  moduleMetadata: {
    imports: [TreeModule]
  },
  template: `
     <pupa-tree [manipulator]="flatTreeConfiguration"></pupa-tree>
  `,
  props: {
    flatTreeConfiguration
  }
}));
