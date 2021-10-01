import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ThemeWrapperService } from '../../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Theme } from '../../../../../../src/internal/declarations/enums/theme.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'demo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly logoDark: SafeResourceUrl;
  private readonly logoLight: SafeResourceUrl;

  public readonly logo$: Observable<SafeResourceUrl> = this.themeWrapperService.theme$.pipe(
    map((themeMode: Theme) => {
      return themeMode === Theme.Light ? this.logoLight : this.logoDark;
    })
  );

  constructor(private readonly themeWrapperService: ThemeWrapperService, private readonly sanitizer: DomSanitizer) {
    this.logoLight = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-light.svg');
    this.logoDark = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-dark.svg');
  }
}
