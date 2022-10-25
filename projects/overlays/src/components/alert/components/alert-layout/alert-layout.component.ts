import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { AlertType } from '../../../../declarations/types/alert-type.type';
import { AlertLayoutHeaderComponent } from '../alert-layout-header/alert-layout-header.component';

@Component({
  selector: 'pupa-alert-layout',
  templateUrl: './alert-layout.component.html',
  styleUrls: ['./alert-layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertLayoutComponent implements AfterContentChecked {
  @ContentChild(AlertLayoutHeaderComponent) private readonly header?: AlertLayoutHeaderComponent;

  public readonly hasHeader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public type: AlertType;

  public ngAfterContentChecked(): void {
    this.hasHeader$.next(!isNil(this.header));
  }
}
