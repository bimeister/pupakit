import { AfterViewInit, Directive } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { AbstractControlMethodsKey } from '../../enums/abstract-control-methods-key.enum';

@Directive()
export abstract class AbstractControlWithNotifier implements AfterViewInit {
  public readonly propertyChanges$: Subject<AbstractControlMethodsKey> = new Subject<AbstractControlMethodsKey>();
  constructor(private readonly ngControl: NgControl) {}

  public ngAfterViewInit(): void {
    this.applyNotifiers();
  }

  private applyNotifiers(): void {
    const control: AbstractControl = this.ngControl.control;

    Object.keys(AbstractControlMethodsKey).forEach((key: string) => {
      const originFunc: VoidFunction = control[key];
      control[key] = this.emitChangesAndCallOriginalFunction.bind(this, control, originFunc, key);
    });
  }

  private emitChangesAndCallOriginalFunction(
    control: AbstractControl,
    originalFunction: VoidFunction,
    key: AbstractControlMethodsKey,
    ...args: unknown[]
  ): void {
    this.propertyChanges$.next(key);
    originalFunction.bind(control)(...args);
  }
}
