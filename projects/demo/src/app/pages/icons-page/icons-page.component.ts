import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IconDefinition } from '@kit/internal/declarations/interfaces/icon-definition.interface';
import { getAllIcons } from '../../../declarations/functions/get-all-icons.function';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isEmpty, stringFilterPredicate } from '@bimeister/utilities';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastsService } from '@kit/internal/shared/services/toasts.service';

@Component({
  selector: 'demo-icons-page',
  templateUrl: './icons-page.component.html',
  styleUrls: ['./icons-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconsPageComponent {
  public readonly searchControl: FormControl = new FormControl('');

  public readonly iconNames: string[] = getAllIcons().map((icon: IconDefinition) => icon.name);

  public readonly filteredIcons$: Observable<string[]> = combineLatest([
    of(this.iconNames),
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([icons, searchValue]: [string[], string]) =>
      isEmpty(searchValue) ? icons : icons.filter((icon: string) => stringFilterPredicate(icon, searchValue))
    )
  );

  public readonly isEmpty$: Observable<boolean> = this.filteredIcons$.pipe(
    map((filteredIcons: string[]) => isEmpty(filteredIcons))
  );

  constructor(private readonly cdkClipboard: Clipboard, private readonly toastsService: ToastsService) {}

  public copyToClipBoard(iconName: string): void {
    this.cdkClipboard.copy(iconName);
    this.toastsService.open({
      data: {
        bodyText: 'Copied to clipboard',
        type: 'info',
      },
    });
  }
}
