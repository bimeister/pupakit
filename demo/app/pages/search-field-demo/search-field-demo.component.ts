import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';

const BASE_REQUEST_PATH: string = 'search-field-demo/examples';

@Component({
  selector: 'demo-search-field-demo',
  templateUrl: './search-field-demo.component.html',
  styleUrls: ['./search-field-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldDemoComponent implements OnInit, OnDestroy {
  public readonly formControl: FormControl = new FormControl('');
  public readonly disabledControl: FormControl = new FormControl();

  private readonly isDisabled$: Observable<boolean> = this.disabledControl.statusChanges.pipe(
    map(() => this.disabledControl.disabled)
  );

  public readonly collapseDirectionOptions: RadioOption[] = [
    {
      caption: 'To Left',
      value: 'to-left',
      isDefault: true
    },
    {
      caption: 'To Right',
      value: 'to-right'
    }
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`
  };

  private readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    this.subscription.add(this.subscribeToIsDisabled());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToIsDisabled(): Subscription {
    return this.isDisabled$.subscribe((isDisabled: boolean) => {
      isDisabled ? this.formControl.disable() : this.formControl.enable();
    });
  }
}
