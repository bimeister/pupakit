export const flatTreeItemDeclarationsData: string = `
class FlatTreeItem<T = any> {
  constructor(
    public readonly isExpandable: boolean,
    public name: string,
    public level: number,
    public id: string,
    public originalData: T = null,
    public isElement: boolean = false
  ) {}
}
`;
