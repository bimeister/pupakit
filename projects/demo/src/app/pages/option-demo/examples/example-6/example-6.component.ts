import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'demo-option-example-6',
  templateUrl: './example-6.component.html',
  styleUrls: ['./example-6.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RouterLinkActive],
})
export class OptionExample6Component {}
