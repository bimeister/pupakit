import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { shareReplayWithRefCount } from '@bimeister/utilities';
import { ToastsService } from '@bimeister/pupakit.overlays';

@Component({
  selector: 'demo-typography-example-mixins',
  templateUrl: './example-mixins.component.html',
  styleUrls: ['./example-mixins.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypographyMixinsComponent {
  public readonly sizeControl: FormControl = new FormControl('m');
  public readonly paragraphControl: FormControl = new FormControl(true);

  public readonly typeControl: FormControl = new FormControl('regular');
  public readonly condensedControl: FormControl = new FormControl(false);

  public readonly sizes: string[] = ['xxl', 'xl', 'l', 'm', 's', 'xs', 'xxs'];
  public readonly types: string[] = ['light', 'regular', 'medium', 'semibold', 'bold'];

  public readonly activeSizeMixin$: Observable<string> = combineLatest([
    this.sizeControl.valueChanges.pipe(startWith(this.sizeControl.value)),
    this.paragraphControl.valueChanges.pipe(startWith(this.paragraphControl.value)),
  ]).pipe(
    map(
      ([sizeValue, isParagraph]: [string, boolean]) => `@include font-size-${sizeValue}(${isParagraph ? true : ''});`
    ),
    shareReplayWithRefCount()
  );

  public readonly activeTypeMixin$: Observable<string> = combineLatest([
    this.typeControl.valueChanges.pipe(startWith(this.typeControl.value)),
    this.condensedControl.valueChanges.pipe(startWith(this.condensedControl.value)),
  ]).pipe(
    map(
      ([typeValue, isCondensed]: [string, boolean]) => `@include font-type-${typeValue}(${isCondensed ? true : ''});`
    ),
    shareReplayWithRefCount()
  );

  constructor(private readonly cdkClipboard: Clipboard, private readonly toastsService: ToastsService) {}

  public copyActiveSizeMixinToClipBoard(): void {
    this.activeSizeMixin$.pipe(take(1)).subscribe((mixin: string) => {
      this.cdkClipboard.copy(mixin);
      this.toastsService.open({
        data: {
          bodyText: 'Copied to clipboard',
          type: 'info',
        },
      });
    });
  }

  public copyActiveTypeMixinToClipBoard(): void {
    this.activeTypeMixin$.pipe(take(1)).subscribe((mixin: string) => {
      this.cdkClipboard.copy(mixin);
      this.toastsService.open({
        data: {
          bodyText: 'Copied to clipboard',
          type: 'info',
        },
      });
    });
  }
}
