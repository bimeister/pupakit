import { ChangeDetectionStrategy, Component, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { isEmpty, isNil, shareReplayWithRefCount, sortByProperty, stringFilterPredicate } from '@bimeister/utilities';
import { DrawerRef } from '@kit/internal/declarations/classes/drawer-ref.class';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface LinkItem {
  title: string;
  link: string;
}

interface LinksGroup {
  title: string;
  linkItems: LinkItem[];
}

@Component({
  selector: 'demo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly infoGroup: LinksGroup = {
    title: 'Info',
    linkItems: sortByProperty(
      [
        { title: 'Typography', link: '/kit/typography' },
        { title: 'Colors', link: '/kit/colors' },
        { title: 'Adaptive', link: '/kit/adaptive' },
      ],
      'title'
    ),
  };

  private readonly generalGroup: LinksGroup = {
    title: 'Components',
    linkItems: sortByProperty(
      [
        { title: 'Icon', link: '/kit/icon' },
        { title: 'Button & Button Icon & Button Round', link: '/kit/button' },
        { title: 'ButtonMulti', link: '/kit/button-multi' },
        { title: 'Actions', link: '/kit/actions' },
        { title: 'Avatar', link: '/kit/avatar' },
        { title: 'Info block', link: '/kit/info-block' },
        { title: 'Input', link: '/kit/input' },
        { title: 'Select', link: '/kit/select' },
        { title: 'Card', link: '/kit/card' },
        { title: 'Textarea', link: '/kit/textarea' },
        { title: 'Date time pickers', link: '/kit/date-time-picker' },
        { title: 'Label', link: '/kit/label' },
        { title: 'Tag', link: '/kit/tag' },
        { title: 'Status', link: '/kit/status' },
        { title: 'Checkbox', link: '/kit/checkbox' },
        { title: 'Radio buttons', link: '/kit/radio' },
        { title: 'Switcher', link: '/kit/switcher' },
        { title: 'Search Field', link: '/kit/search-field' },
        { title: 'Table', link: '/kit/table' },
        { title: 'Tree', link: '/kit/tree-new' },
        { title: 'Tabs', link: '/kit/tabs' },
        { title: 'Floating Card', link: '/kit/floating-card' },
        { title: 'Button Group', link: '/kit/button-group' },
        { title: 'Scrollable', link: '/kit/scrollable' },
        { title: 'Paged Virtual Scroll', link: '/kit/paged-virtual-scroll' },
        { title: 'Badge', link: '/kit/badge' },
        { title: 'Breadcrumbs', link: '/kit/breadcrumbs' },
        { title: 'Spinner & loader', link: '/kit/spinner' },
        { title: 'Rating', link: '/kit/rating' },
        { title: 'Day selector', link: '/kit/day-selector' },
        { title: 'Link', link: '/kit/link' },
        { title: 'Timer', link: '/kit/timer' },
        { title: 'Counter', link: '/kit/counter' },
        { title: 'Stepper', link: '/kit/stepper' },
        { title: 'Form Layout', link: '/kit/form-layout' },
        { title: '⚠️ Chip Tabs', link: '/kit/chip-tabs' },
        { title: '⚠️ Chip', link: '/kit/chip' },
        { title: '⚠️ Vertical Tabs', link: '/kit/vertical-tabs' },
        { title: '⚠️ Datagrid', link: '/kit/datagrid' },
        { title: '⚠️ Tree', link: '/kit/tree' },
        { title: '⚠️ Uploads', link: '/kit/uploads' },
        { title: '⚠️ Icon button', link: '/kit/icon-button' },
        { title: '⚠️ Draggable', link: '/kit/draggable' },
        { title: '⚠️ Droppable', link: '/kit/droppable' },
        { title: '⚠️ Draggable list', link: '/kit/draggable-list' },
      ],
      'title'
    ),
  };

  private readonly overlayGroup: LinksGroup = {
    title: 'Overlay Components',
    linkItems: sortByProperty(
      [
        { title: 'Dropdown', link: '/kit/dropdown' },
        { title: 'Dropdown menu', link: '/kit/dropdown-menu' },
        { title: 'Tooltip', link: '/kit/tooltip' },
        { title: 'Alert', link: '/kit/alerts' },
        { title: 'Toast', link: '/kit/toasts' },
        { title: '⚠️ Drawer', link: '/kit/drawer-old' },
        { title: 'Drawer', link: '/kit/drawer' },
        { title: 'Modal', link: '/kit/modal' },
        { title: 'Popover', link: '/kit/popover' },
      ],
      'title'
    ),
  };

  private readonly demoToolsGroup: LinksGroup = {
    title: 'Demo Tools',
    linkItems: sortByProperty([{ title: 'Code', link: '/kit/code' }], 'title'),
  };

  private readonly otherGroup: LinksGroup = {
    title: 'Other',
    linkItems: sortByProperty(
      [
        { title: 'Layout', link: './layout' },
        { title: '⚠️ Scrollbar Styles', link: '/kit/scrollbar' },
      ],
      'title'
    ),
  };

  private readonly linkGroups: LinksGroup[] = [
    this.infoGroup,
    this.generalGroup,
    this.overlayGroup,
    this.demoToolsGroup,
    this.otherGroup,
  ];

  public readonly searchControl: FormControl = new FormControl('');

  public filteredLinkGroups$: Observable<LinksGroup[]> = this.searchControl.valueChanges.pipe(
    startWith(''),
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
          linkItems: filteredLinks,
        });

        return filteredGroups;
      }, []);
    }),
    shareReplayWithRefCount()
  );

  public isEmpty$: Observable<boolean> = this.filteredLinkGroups$.pipe(
    map((filteredLinkGroups: LinksGroup[]) => isEmpty(filteredLinkGroups))
  );

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
}
