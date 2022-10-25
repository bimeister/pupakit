import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { OptionComponent } from '@bimeister/pupakit.kit';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'demo-option-example-5',
  templateUrl: './example-5.component.html',
  styleUrls: ['./example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionExample5Component implements AfterViewInit {
  @ViewChild('disabledOption') private readonly option: OptionComponent;

  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public ngAfterViewInit(): void {
    this.disabled$.next(this.option.disabled);
  }
}
