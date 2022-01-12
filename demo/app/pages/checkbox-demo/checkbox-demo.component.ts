import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

const MAX_LABEL_STRING_LENGTH: number = 21;
const MAX_HINT_STRING_LENGTH: number = 25;

@Component({
  selector: 'demo-checkbox',
  templateUrl: './checkbox-demo.component.html',
  styleUrls: ['./checkbox-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxDemoComponent {
  public readonly control: FormControl = new FormControl(false);
  public label: string = 'Очень большое название чего-либо';
  public hint: string = 'Очень большое описание чего-либо';

  public readonly isNeedDisableTooltip$: Observable<boolean> = of(
    MAX_LABEL_STRING_LENGTH > this.label.length || MAX_HINT_STRING_LENGTH > this.hint.length
  );

  public checkboxExampleCode: {
    HTML: string;
  } = {
    HTML: 'checkbox-demo/examples/checkbox-demo-example/checkbox-demo-example.component.html',
  };
}
