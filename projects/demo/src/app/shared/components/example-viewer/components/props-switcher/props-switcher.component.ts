import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PropsBase } from '../../declarations/classes/props-base.abstract';

@Component({
  selector: 'demo-props-switcher',
  templateUrl: './props-switcher.component.html',
  styleUrls: ['./props-switcher.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PropsSwitcherComponent,
      multi: true,
    },
  ],
})
export class PropsSwitcherComponent extends PropsBase implements OnInit {
  @Input() public initialValue: boolean = false;

  public ngOnInit(): void {
    if (!this.initialValue) {
      return;
    }

    setTimeout(() => {
      this.formControl.setValue(true);
    });
  }
}
