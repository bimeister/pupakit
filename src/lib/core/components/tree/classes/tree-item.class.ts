/** @deprecated unstable */
export class TreeItem {
  constructor(public name: string, public children?: TreeItem[], public id: string = name) {}
}
