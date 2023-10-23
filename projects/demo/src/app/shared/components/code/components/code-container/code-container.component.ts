import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { filterNotEmpty, filterNotNil, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, forkJoin, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ExamplesRequestsService } from '../../../../services/requests/examples-request.service';
import { CodeContainerPreviewTemplateDirective } from '../../directives/code-container-preview-template.directive';

interface Tab {
  name: string;
  code: string;
}

const PREVIEW_TAB_NAME: string = 'Preview';

@Component({
  selector: 'pupa-code-container',
  templateUrl: './code-container.component.html',
  styleUrls: ['./code-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeContainerComponent implements OnInit, OnChanges {
  @ContentChild(CodeContainerPreviewTemplateDirective, { static: true })
  public previewTemplate: CodeContainerPreviewTemplateDirective;

  @Input() public content: Nullable<Record<string, string>> = null;

  public readonly contentWithCode$: BehaviorSubject<Nullable<Record<string, string>>> = new BehaviorSubject<
    Nullable<Record<string, string>>
  >(null);

  @Input() public isPreviewExist: boolean = true;
  public readonly isPreviewExist$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly tabs$: Observable<Tab[]> = combineLatest([
    this.contentWithCode$.pipe(filterNotEmpty()),
    this.isPreviewExist$,
  ]).pipe(
    map(([contentWithCode, isPreviewExist]: [Record<string, string>, boolean]) => {
      const tabNames: string[] = Object.keys(contentWithCode);
      const names: string[] = isPreviewExist ? [PREVIEW_TAB_NAME, ...tabNames] : tabNames;

      return names.map((tabName: string) => ({
        name: tabName,
        code: tabName === PREVIEW_TAB_NAME ? null : contentWithCode[tabName],
      }));
    })
  );

  constructor(private readonly examplesRequestsService: ExamplesRequestsService) {}

  public ngOnInit(): void {
    this.processCodeRequests();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsPreviewExistChange(changes?.isPreviewExist);
  }

  private processCodeRequests(): void {
    if (isEmpty(this.content)) {
      return;
    }

    const tabNames: string[] = Object.keys(this.content);

    forkJoin(tabNames.map((tabName: string) => this.examplesRequestsService.getExampleRawFile(this.content[tabName])))
      .pipe(
        take(1),
        map((codes: string[]) => {
          const codeEntries: Map<string, string> = new Map(
            codes.map((code: string, codeIndex: number) => [tabNames[codeIndex], code])
          );
          return Object.fromEntries(codeEntries);
        }),
        filterNotNil(),
        take(1)
      )
      .subscribe((content: Record<string, string>) => this.contentWithCode$.next(content));
  }

  private processIsPreviewExistChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isPreviewExist$.next(updatedValue);
  }
}
