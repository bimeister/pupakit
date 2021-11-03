import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';

const BASE_REQUEST_PATH: string = 'button-multi-demo/examples';

@Component({
  selector: 'demo-button-multi',
  templateUrl: './button-multi-demo.component.html',
  styleUrls: ['./button-multi-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ButtonMultiDemoComponent {
  @ViewChild('activeRadio') public readonly activeRadio$: Observable<Nullable<string>>;
  public active$: Observable<boolean>;
  public expandActive$: Observable<boolean>;
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`
  };
  public readonly sizeOptions: RadioOption[] = [
    {
      caption: 'Large',
      value: 'large'
    },
    {
      caption: 'Medium',
      value: 'medium',
      isDefault: true
    },
    {
      caption: 'Small',
      value: 'small'
    }
  ];

  public readonly kindOptions: RadioOption[] = [
    {
      caption: 'Primary',
      value: 'primary'
    },
    {
      caption: 'Secondary',
      value: 'secondary'
    },
    {
      caption: 'Warning',
      value: 'warning'
    },
    {
      caption: 'Danger',
      value: 'danger'
    },
    {
      caption: 'Border',
      value: 'border'
    }
  ];

  public readonly iconPositionOptions: RadioOption[] = [
    {
      caption: 'Unset',
      value: null
    },
    {
      caption: 'Left',
      value: 'left'
    },
    {
      caption: 'Right',
      value: 'right'
    }
  ];

  public readonly activeOptions: RadioOption[] = [
    {
      caption: 'Unset',
      value: null
    },
    {
      caption: 'active (button)',
      value: 'active'
    },
    {
      caption: 'active (arrow)',
      value: 'expandActive'
    }
  ];

  public ngAfterViewInit(): void {
    this.active$ = this.activeRadio$.pipe(
      map((activeRadio: Nullable<string>) => activeRadio === 'active'),
      shareReplayWithRefCount()
    );
    this.expandActive$ = this.activeRadio$.pipe(
      map((activeRadio: Nullable<string>) => activeRadio === 'expandActive'),
      shareReplayWithRefCount()
    );
  }
}
