import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { PageTabDirective } from '../../directives/page-tab.directive';
import { PageTabNames } from '../../declarations/types/page-tab-names.type';
import { filterFalsy, isEmpty, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface BaseTab {
  title: string;
  name: PageTabNames;
}

interface Tab extends BaseTab {
  templateRef: TemplateRef<unknown>;
}

const TAB_TITLE_BY_NAME_MAP: Map<PageTabNames, string> = new Map([
  ['overview', 'Description and Examples'],
  ['api', 'Api'],
]);

@Component({
  selector: 'demo-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements AfterContentInit {
  @ContentChildren(PageTabDirective) public pageTabDirectivesList: QueryList<PageTabDirective>;
  private readonly pageTabDirectives$: BehaviorSubject<Nullable<PageTabDirective[]>> = new BehaviorSubject<
    Nullable<PageTabDirective[]>
  >(null);

  public readonly isNoTabsMode$: Observable<boolean> = this.pageTabDirectives$.pipe(
    map((directives: PageTabDirective[]) => isEmpty(directives))
  );

  public readonly pageTabs$: Observable<Tab[]> = this.isNoTabsMode$.pipe(
    filterFalsy(),
    switchMap(() => this.pageTabDirectives$),
    map((directives: PageTabDirective[]) =>
      directives.map(({ demoPageTab: name, templateRef }: PageTabDirective) => {
        const title: string = TAB_TITLE_BY_NAME_MAP.get(name);
        return { name, title, templateRef };
      })
    )
  );

  public ngAfterContentInit(): void {
    this.processPageTabDirectives();
  }

  private processPageTabDirectives(): void {
    const pageTabDirectives: PageTabDirective[] = this.pageTabDirectivesList.toArray();

    if (isEmpty(pageTabDirectives)) {
      return;
    }

    this.pageTabDirectives$.next(pageTabDirectives);
  }
}
