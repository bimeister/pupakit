import { ChangeDetectorRef } from '@angular/core';

export interface TreeItemNode {
  enable: boolean;
  key: string;
  value: string;
  icon: string;
  clickable: boolean;
  children: TreeItemNode[];
  parent: TreeItemNode;
  opened: boolean;
  active: boolean;
  changeDetector: ChangeDetectorRef;
}
