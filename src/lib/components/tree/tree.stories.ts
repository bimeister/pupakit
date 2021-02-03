import { getUuid } from '@bimeister/utilities';
import { storiesOf } from '@storybook/angular';
import { FlatTreeItem } from '../../../internal/declarations/classes/flat-tree-item.class';
import { TreeModule } from './tree.module';

const leafElementsCount: number = 1000;
const dataOrigin: FlatTreeItem[] = [
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
    .map((_, index: number) => new FlatTreeItem(false, `😀 ${index + 1}`, 2, null)),
  new FlatTreeItem(true, 'Sad', 1, null),
  ...new Array(leafElementsCount)
    .fill(null)
    .map((_, index: number) => new FlatTreeItem(false, `😥 ${index + 1}`, 2, null)),
  new FlatTreeItem(false, '🐵', 1, null),
  new FlatTreeItem(false, '🙊', 1, null),
  new FlatTreeItem(false, '🙉', 1, null),
  new FlatTreeItem(false, '🙈', 1, null)
].map((item: FlatTreeItem) => ({ ...item, id: getUuid() }));

storiesOf('Tree', module).add('default', () => ({
  moduleMetadata: {
    imports: [TreeModule]
  },
  template: `

  <pupa-tree [dataOrigin]="dataOrigin"></pupa-tree>
  `,
  props: {
    dataOrigin
  }
}));
