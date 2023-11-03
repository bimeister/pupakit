import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastsService } from '@bimeister/pupakit.overlays';

@Component({
  selector: 'demo-search-field-demo-example-action',
  templateUrl: './search-field-demo-example-action.component.html',
  styleUrls: ['./search-field-demo-example-action.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldDemoExampleActionComponent {
  public readonly searchControl1: FormControl<string> = new FormControl<string>('');
  public readonly searchControl2: FormControl<string> = new FormControl<string>('');
  public readonly searchControl3: FormControl<string> = new FormControl<string>('');
  public readonly searchControl4: FormControl<string> = new FormControl<string>('');

  constructor(private readonly toastsService: ToastsService) {}

  public showToast(): void {
    this.toastsService.open({ data: { bodyText: 'Action clicked!', type: 'info' } });
  }
}
