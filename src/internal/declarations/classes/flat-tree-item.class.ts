export class FlatTreeItem {
  constructor(
    public readonly isExpandable: boolean,
    public name: string,
    public level: number,
    public id: string,
    public originalData: any = null,
    public isElement: boolean = false
  ) {}
}
