import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isEmpty, stringFilterPredicate } from '@bimeister/utilities';
import { Clipboard } from '@angular/cdk/clipboard';
import { getAllIcons, IconDefinition } from '@bimeister/pupakit.icons';
import { ToastsService } from '@bimeister/pupakit.overlays';

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
