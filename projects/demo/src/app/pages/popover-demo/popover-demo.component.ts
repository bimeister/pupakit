import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DEFAULT_POPOVER_TRIGGER_CSS_CLASS } from '@bimeister/pupakit.overlays';

const BASE_REQUEST_PATH: string = 'popover-demo/examples';

@Component({
  selector: 'demo-popover-demo',
  templateUrl: './popover-demo.component.html',
  styleUrls: ['./popover-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopoverDemoComponent {
  public readonly defaultPopoverTriggerCssClass: string = DEFAULT_POPOVER_TRIGGER_CSS_CLASS;

  public readonly basicExampleContent: Record<string, string> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'layout.component.html': `${BASE_REQUEST_PATH}/basic-example/popover-layout-basic/popover-layout-basic.component.html`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'layout.component.ts': `${BASE_REQUEST_PATH}/basic-example/popover-layout-basic/popover-layout-basic.component.ts`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'trigger.component.html': `${BASE_REQUEST_PATH}/basic-example/popover-trigger-basic/popover-trigger-basic.component.html`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'trigger.component.ts': `${BASE_REQUEST_PATH}/basic-example/popover-trigger-basic/popover-trigger-basic.component.ts`,
  };

  public readonly coordinatesExampleContent: Record<string, string> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'layout.component.html': `${BASE_REQUEST_PATH}/coordinates-example/popover-layout-coordinates/popover-layout-coordinates.component.html`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'layout.component.ts': `${BASE_REQUEST_PATH}/coordinates-example/popover-layout-coordinates/popover-layout-coordinates.component.ts`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'trigger.component.html': `${BASE_REQUEST_PATH}/coordinates-example/popover-trigger-coordinates/popover-trigger-coordinates.component.html`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'trigger.component.ts': `${BASE_REQUEST_PATH}/coordinates-example/popover-trigger-coordinates/popover-trigger-coordinates.component.ts`,
  };

  public readonly directiveExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/directive-example/directive-example.component.html`,
  };

  public readonly otherExampleContent: Record<string, string> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'layout.component.html': `${BASE_REQUEST_PATH}/other-example/popover-layout-other/popover-layout-other.component.html`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'layout.component.ts': `${BASE_REQUEST_PATH}/other-example/popover-layout-other/popover-layout-other.component.ts`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'trigger.component.html': `${BASE_REQUEST_PATH}/other-example/popover-trigger-other/popover-trigger-other.component.html`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'trigger.component.ts': `${BASE_REQUEST_PATH}/other-example/popover-trigger-other/popover-trigger-other.component.ts`,
  };
}
