import { FlatTreeItem } from '@bimeister/pupakit.tree';

const ANIMAL: FlatTreeItem = new FlatTreeItem(true, '🦄 Animals', null, '1', { parentId: null });
const CAT: FlatTreeItem = new FlatTreeItem(true, '😺 Cats', null, '2', { parentId: ANIMAL.id });
const DOG: FlatTreeItem = new FlatTreeItem(true, '🐶 Dogs', null, '3', { parentId: ANIMAL.id });
const RABBIT: FlatTreeItem = new FlatTreeItem(true, '🐰 Rabbits', null, '4', { parentId: ANIMAL.id });
const PLANT: FlatTreeItem = new FlatTreeItem(false, '🌿 Plants', null, '5', { parentId: null });

const CAT_CHILD_1: FlatTreeItem = new FlatTreeItem(false, '😺 Cats child 1', null, '6', { parentId: CAT.id }, true);
const CAT_CHILD_2: FlatTreeItem = new FlatTreeItem(false, '😺 Cats child 2', null, '7', { parentId: CAT.id }, true);
const CAT_CHILD_3: FlatTreeItem = new FlatTreeItem(false, '😺 Cats child 3', null, '8', { parentId: CAT.id }, true);

const DOG_CHILD_1: FlatTreeItem = new FlatTreeItem(false, '🐶 Dogs child 1', null, '9', { parentId: DOG.id }, true);
const DOG_CHILD_2: FlatTreeItem = new FlatTreeItem(false, '🐶 Dogs child 2', null, '10', { parentId: DOG.id }, true);
const DOG_CHILD_3: FlatTreeItem = new FlatTreeItem(false, '🐶 Dogs child 3', null, '11', { parentId: DOG.id }, true);

const RABBIT_CHILD_1: FlatTreeItem = new FlatTreeItem(
  false,
  '🐰 Rabbits child 1',
  null,
  '12',
  { parentId: RABBIT.id },
  true
);
const RABBIT_CHILD_2: FlatTreeItem = new FlatTreeItem(
  false,
  '🐰 Rabbits child 2',
  null,
  '13',
  { parentId: RABBIT.id },
  true
);
const RABBIT_CHILD_3: FlatTreeItem = new FlatTreeItem(
  false,
  '🐰 Rabbits child 3',
  null,
  '14',
  { parentId: RABBIT.id },
  true
);

const ANOTHER_ORGANISM_1: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 1',
  null,
  '15',
  {
    parentId: null,
  },
  true
);

const ANOTHER_ORGANISM_2: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 2',
  null,
  '16',
  {
    parentId: null,
  },
  true
);

const ANOTHER_ORGANISM_3: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 3',
  null,
  '17',
  {
    parentId: null,
  },
  true
);

const ANOTHER_ORGANISM_4: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 4',
  null,
  '18',
  {
    parentId: null,
  },
  true
);

const ANOTHER_ORGANISM_5: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 5',
  null,
  '19',
  {
    parentId: null,
  },
  true
);

const ANOTHER_ORGANISM_6: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 6',
  null,
  '20',
  {
    parentId: null,
  },
  true
);

const ANOTHER_ORGANISM_7: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 7',
  null,
  '21',
  {
    parentId: null,
  },
  true
);

const ANOTHER_ORGANISM_8: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 8',
  null,
  '22',
  {
    parentId: null,
  },
  true
);

const ANOTHER_ORGANISM_9: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 9',
  null,
  '23',
  {
    parentId: null,
  },
  true
);

const ANOTHER_ORGANISM_10: FlatTreeItem = new FlatTreeItem(
  false,
  '🦠 Another organisms 10',
  null,
  '24',
  {
    parentId: null,
  },
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
  ANOTHER_ORGANISM_1,
  ANOTHER_ORGANISM_2,
  ANOTHER_ORGANISM_3,
  ANOTHER_ORGANISM_4,
  ANOTHER_ORGANISM_5,
  ANOTHER_ORGANISM_6,
  ANOTHER_ORGANISM_7,
  ANOTHER_ORGANISM_8,
  ANOTHER_ORGANISM_9,
  ANOTHER_ORGANISM_10,
];
