export abstract class BusEventBase<T = any> {
  public abstract readonly type: string;
  public abstract readonly scope: string;
  public abstract readonly id: string;
  public abstract readonly fromId: string;

  public readonly payload?: T;
}
