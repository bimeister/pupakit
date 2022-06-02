import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'demo-card-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDemoExample3Component {
  public readonly logoIcon: SafeResourceUrl;

  constructor(sanitizer: DomSanitizer) {
    this.logoIcon = sanitizer.bypassSecurityTrustResourceUrl('assets/logo-icon.svg');
  }
}
