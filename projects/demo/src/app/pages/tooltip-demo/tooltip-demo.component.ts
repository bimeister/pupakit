import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'tooltip-demo/examples';
const DEFAULT_VALUE: string = `
  <div>
    But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a
    complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human
    happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to
    pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or
    desires to obtain pain of itself, because it is pain.
  </div>
  <div>
    On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of
    pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame
    belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.
    These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing
    prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain
    circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be
    repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects
    pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.
  </div>
`;

@Component({
  selector: 'demo-tooltip',
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent {
  public readonly contentControl: FormControl = new FormControl(DEFAULT_VALUE.trim());

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-5/example-5.component.html`,
  };

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-6/example-6.component.html`,
  };

  public readonly tooltipAppearanceOptions: PropsOption[] = [
    {
      caption: 'Always',
      value: 'always',
      isDefault: true,
    },
    {
      caption: 'Truncate',
      value: 'truncate',
    },
  ];

  constructor(private readonly domSanitizer: DomSanitizer) {}

  public getSanitizedHtml(): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(this.contentControl.value);
  }
}
