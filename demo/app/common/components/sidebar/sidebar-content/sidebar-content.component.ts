import { ChangeDetectionStrategy, Component, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isEmpty, isNil, Nullable, shareReplayWithRefCount, stringFilterPredicate } from '@bimeister/utilities';

import { DrawerRef } from '../../../../../../src/internal/declarations/classes/drawer-ref.class';
import { ThemeWrapperService } from '../../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Theme } from '../../../../../../src/internal/declarations/enums/theme.enum';

interface LinkItem {
  title: string;
  link: string;
}

interface LinksGroup {
  title: string;
  linkItems: LinkItem[];
}

@Component({
  selector: 'demo-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarContentComponent {
  private readonly generalGroup: LinksGroup = {
    title: 'General',
    linkItems: [
      { title: 'Typography', link: '/kit/typography' },
      { title: 'Colors', link: '/kit/colors' },
      { title: 'Icon', link: '/kit/icon' },
      { title: 'Button & Button Icon & Button Round', link: '/kit/button' },
      { title: 'ButtonMulti', link: '/kit/button-multi' },
      { title: 'Avatar', link: '/kit/avatar' },
      { title: 'Adaptive', link: '/kit/adaptive' },
      { title: 'Code', link: '/kit/code' },
      { title: 'Floating Card', link: '/kit/floating-card' },
      { title: 'Info block', link: '/kit/info-block' },
      { title: 'Input', link: '/kit/input' },
      { title: 'Label', link: '/kit/label' },
    ]
  };

  private readonly dataEntryGroup: LinksGroup = {
    title: 'Data Entry',
    linkItems: [
      { title: 'Checkbox', link: '/kit/checkbox' },
      { title: 'Switcher', link: '/kit/switcher' },
      { title: 'Table Input', link: '/kit/table-input' },
      { title: 'Search Field', link: '/kit/search-field' },
      { title: '⚠️ Textarea', link: '/kit/textarea' },
      { title: 'Radio buttons', link: '/kit/radio' },
      { title: 'Rating', link: '/kit/rating' },
      { title: '⚠️ Select', link: '/kit/select' },
      { title: 'Selector', link: '/kit/selector' },
      { title: '⚠️ Uploads', link: '/kit/uploads' }
    ]
  };

  private readonly dataDisplayGroup: LinksGroup = {
    title: 'Data Display',
    linkItems: [
      { title: 'Datagrid', link: '/kit/datagrid' },
      { title: 'Table', link: '/kit/table' },
      { title: 'Tree', link: '/kit/tree' },
      { title: 'Tree (new)', link: '/kit/tree-new' },
      { title: 'Tooltip', link: '/kit/tooltip' },
      { title: 'Tabs', link: '/kit/tabs' },
      { title: 'Vertical Tabs', link: '/kit/vertical-tabs' },
      { title: 'Chip Tabs', link: '/kit/chip-tabs' },
      { title: 'Chip', link: '/kit/chip' },
      { title: 'Chip button', link: '/kit/chip-button' },
      { title: 'Paged Virtual Scroll', link: '/kit/paged-virtual-scroll' },
      { title: 'Tag & Color Tag', link: '/kit/tag' },
      { title: 'Status', link: '/kit/status' },
      { title: 'Badge', link: '/kit/badge' },
      { title: 'Breadcrumbs', link: '/kit/breadcrumbs' }
    ]
  };

  private readonly feedbackGroup: LinksGroup = {
    title: 'Feedback',
    linkItems: [
      { title: 'Drawer', link: '/kit/drawer' },
      { title: 'Modal', link: '/kit/modal' },
      { title: 'Spinner & loader', link: '/kit/spinner' }
    ]
  };

  private readonly otherGroup: LinksGroup = {
    title: 'Other',
    linkItems: [
      { title: 'Tile', link: '/kit/tile' },
      { title: '⚠️ Draggable', link: '/kit/draggable' },
      { title: '⚠️ Droppable', link: '/kit/droppable' },
      { title: '⚠️ Dropdown', link: '/kit/dropdown' },
      { title: 'Dropdown menu', link: '/kit/dropdown-menu' },
      { title: 'Layout', link: './layout' },
      { title: 'Controls isPatched', link: '/kit/controls-is-patched' }
    ]
  };

  private readonly deprecatedGroup: LinksGroup = {
    title: 'Deprecated, unused, useless',
    linkItems: [
      { title: '⚠️ Icon button', link: '/kit/icon-button' },
      { title: 'Draggable list', link: '/kit/draggable-list' },
      { title: 'Multiselection list', link: '/kit/multiselection-list' },
      { title: 'Select Multiple', link: '/kit/select-multiple' },
      { title: 'Day selector', link: '/kit/day-selector' },
      { title: 'Time input', link: '/kit/time-input' },
      { title: 'Scrollbar', link: '/kit/scrollbar' }
    ]
  };

  private readonly linkGroups: LinksGroup[] = [
    this.generalGroup,
    this.dataEntryGroup,
    this.dataDisplayGroup,
    this.feedbackGroup,
    this.otherGroup,
    this.deprecatedGroup
  ];

  private readonly searchValue$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);
  public filteredLinkGroups$: Observable<LinksGroup[]> = this.searchValue$.pipe(
    map((searchValue: string) => {
      if (isEmpty(searchValue)) {
        return this.linkGroups;
      }

      return this.linkGroups.reduce((filteredGroups: LinksGroup[], group: LinksGroup) => {
        const filteredLinks: LinkItem[] = group.linkItems.filter((linkItem: LinkItem) =>
          stringFilterPredicate(linkItem.title, searchValue)
        );

        if (isEmpty(filteredLinks)) {
          return filteredGroups;
        }

        filteredGroups.push({
          ...group,
          linkItems: filteredLinks
        });

        return filteredGroups;
      }, []);
    }),
    shareReplayWithRefCount()
  );

  public isEmpty$: Observable<boolean> = this.filteredLinkGroups$.pipe(
    map((filteredLinkGroups: LinksGroup[]) => isEmpty(filteredLinkGroups))
  );

  public searchFieldContainerAdditionaslClassName$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public isOpenInDrawer: boolean = !isNil(this.drawerRef);

  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(
    @Inject(DrawerRef) @Optional() private readonly drawerRef: DrawerRef<number>,
    private readonly themeWrapperService: ThemeWrapperService
  ) {}

  public handleClickLink(): void {
    this.closeSidebar();
  }

  public closeSidebar(): void {
    if (this.isOpenInDrawer) {
      this.drawerRef.close();
    }
  }

  public setSearchValue(searchValue: string): void {
    this.searchValue$.next(searchValue);
  }

  public processItemsScroll(event: Event): void {
    const target: EventTarget = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const scrollTop: number = target.scrollTop;

    if (scrollTop > 0) {
      this.searchFieldContainerAdditionaslClassName$.next('with-shadow');
      return;
    }

    this.searchFieldContainerAdditionaslClassName$.next('');
  }
}
