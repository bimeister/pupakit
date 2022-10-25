import { FlatTreeItem } from '@bimeister/pupakit.tree';
import { getUuid } from '@bimeister/utilities';

const ANIMAL: FlatTreeItem = new FlatTreeItem(true, '🦄 Animals', null, getUuid(), { parentId: null });
const CAT: FlatTreeItem = new FlatTreeItem(true, '😺 Cats', null, getUuid(), { parentId: ANIMAL.id });
const DOG: FlatTreeItem = new FlatTreeItem(true, '🐶 Dogs', null, getUuid(), { parentId: ANIMAL.id });
const RABBIT: FlatTreeItem = new FlatTreeItem(true, '🐰 Rabbits', null, getUuid(), { parentId: ANIMAL.id });
const PLANT: FlatTreeItem = new FlatTreeItem(false, '🌿 Plants', null, getUuid(), { parentId: null });

const CAT_CHILD_1: FlatTreeItem = new FlatTreeItem(
  false,
  '😺 Cats child 1',
  null,
  getUuid(),
  { parentId: CAT.id },
  true
);
const CAT_CHILD_2: FlatTreeItem = new FlatTreeItem(
  false,
  '😺 Cats child 2',
  null,
  getUuid(),
  { parentId: CAT.id },
  true
);
const CAT_CHILD_3: FlatTreeItem = new FlatTreeItem(
  false,
  '😺 Cats child 3',
  null,
  getUuid(),
  { parentId: CAT.id },
  true
);

const DOG_CHILD_1: FlatTreeItem = new FlatTreeItem(
  false,
  '🐶 Dogs child 1',
  null,
  getUuid(),
  { parentId: DOG.id },
  true
);
const DOG_CHILD_2: FlatTreeItem = new FlatTreeItem(
  false,
  '🐶 Dogs child 2',
  null,
  getUuid(),
  { parentId: DOG.id },
  true
);
const DOG_CHILD_3: FlatTreeItem = new FlatTreeItem(
  false,
  '🐶 Dogs child 3',
  null,
  getUuid(),
  { parentId: DOG.id },
  true
);

const RABBIT_CHILD_1: FlatTreeItem = new FlatTreeItem(
  false,
  '🐰 Rabbits child 1',
  null,
  getUuid(),
  { parentId: RABBIT.id },
  true
);
const RABBIT_CHILD_2: FlatTreeItem = new FlatTreeItem(
  false,
  '🐰 Rabbits child 2',
  null,
  getUuid(),
  { parentId: RABBIT.id },
  true
);
const RABBIT_CHILD_3: FlatTreeItem = new FlatTreeItem(
  false,
  '🐰 Rabbits child 3',
  null,
  getUuid(),
  { parentId: RABBIT.id },
  true
);

export const DATA: FlatTreeItem[] = [
  ANIMAL,
  CAT,
  CAT_CHILD_1,
  CAT_CHILD_2,
  CAT_CHILD_3,
  DOG,
  DOG_CHILD_1,
  DOG_CHILD_2,
  DOG_CHILD_3,
  RABBIT,
  RABBIT_CHILD_1,
  RABBIT_CHILD_2,
  RABBIT_CHILD_3,
  PLANT,
];
