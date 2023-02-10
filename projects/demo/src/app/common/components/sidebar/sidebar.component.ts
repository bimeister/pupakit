import { ChangeDetectionStrategy, Component, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DrawerRef } from '@bimeister/pupakit.overlays';
import { isEmpty, isNil, shareReplayWithRefCount, sortByProperty, stringFilterPredicate } from '@bimeister/utilities';
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
  private readonly commonGroup: LinksGroup = {
    title: 'Common',
    linkItems: sortByProperty(
      [
        { title: 'Typography', link: '/kit/typography' },
        { title: 'Colors', link: '/kit/colors' },
        { title: 'Adaptive', link: '/kit/adaptive' },
      ],
      'title'
    ),
  };

  private readonly kitGroup: LinksGroup = {
    title: 'Kit',
    linkItems: sortByProperty(
      [
        { title: 'Accordion', link: '/kit/accordion' },
        { title: 'Icon holder', link: '/kit/icon-holder' },
        { title: 'Button Multi', link: '/kit/button-multi' },
        { title: 'Button Round', link: '/kit/button-round' },
        { title: 'Button Icon', link: '/kit/button-icon' },
        { title: 'Button', link: '/kit/button' },
        { title: 'Dropdown', link: '/kit/dropdown' },
        { title: 'Dropdown menu', link: '/kit/dropdown-menu' },
        { title: 'Avatar', link: '/kit/avatar' },
        { title: 'Section', link: '/kit/section' },
        { title: 'Card', link: '/kit/card' },
        { title: 'Tag', link: '/kit/tag' },
        { title: 'Status', link: '/kit/status' },
        { title: 'Tabs', link: '/kit/tabs' },
        { title: 'Button Group', link: '/kit/button-group' },
        { title: 'Scrollable', link: '/kit/scrollable' },
        { title: 'Badge', link: '/kit/badge' },
        { title: 'Breadcrumbs', link: '/kit/breadcrumbs' },
        { title: 'Spinner & loader', link: '/kit/spinner' },
        { title: 'Link', link: '/kit/link' },
        { title: 'Timer', link: '/kit/timer' },
        { title: 'Counter', link: '/kit/counter' },
        { title: 'Stepper', link: '/kit/stepper' },
        { title: 'Option', link: '/kit/option' },
      ],
      'title'
    ),
  };

  private readonly formsGroup: LinksGroup = {
    title: 'Forms',
    linkItems: sortByProperty(
      [
        { title: 'Input', link: '/kit/input' },
        { title: 'Select', link: '/kit/select' },
        { title: 'Textarea', link: '/kit/textarea' },
        { title: 'Date time pickers', link: '/kit/date-time-picker' },
        { title: 'Label', link: '/kit/label' },
        { title: 'Required Field', link: '/kit/required-field' },
        { title: 'Checkbox', link: '/kit/checkbox' },
        { title: 'Radio buttons', link: '/kit/radio' },
        { title: 'Switcher', link: '/kit/switcher' },
        { title: 'Search Field', link: '/kit/search-field' },
        { title: 'Rating', link: '/kit/rating' },
        { title: 'Day selector', link: '/kit/day-selector' },
        { title: 'Form Layout', link: '/kit/form-layout' },
      ],
      'title'
    ),
  };

  private readonly iconsGroup: LinksGroup = {
    title: 'Icons',
    linkItems: sortByProperty(
      [
        { title: 'Icons', link: '/kit/icons' },
        { title: 'Icon', link: '/kit/icon' },
      ],
      'title'
    ),
  };

  private readonly widgetsGroup: LinksGroup = {
    title: 'Widgets',
    linkItems: sortByProperty(
      [
        { title: 'Actions', link: '/kit/actions' },
        { title: 'Infinity Scroller', link: '/kit/infinity-scroller' },
        { title: 'Floating Card', link: '/kit/floating-card' },
        { title: 'Paged Virtual Scroll', link: '/kit/paged-virtual-scroll' },
      ],
      'title'
    ),
  };

  private readonly tableGroup: LinksGroup = {
    title: 'Table',
    linkItems: sortByProperty([{ title: 'Table', link: '/kit/table' }], 'title'),
  };

  private readonly treeGroup: LinksGroup = {
    title: 'Tree',
    linkItems: sortByProperty(
      [
        { title: 'Tree', link: '/kit/tree-new' },
        { title: 'Tree node', link: '/kit/tree-node' },
      ],
      'title'
    ),
  };

  private readonly overlaysGroup: LinksGroup = {
    title: 'Overlays',
    linkItems: sortByProperty(
      [
        { title: 'Alert', link: '/kit/alerts' },
        { title: 'Toast', link: '/kit/toasts' },
        { title: 'Drawer', link: '/kit/drawer' },
        { title: 'Modal', link: '/kit/modal' },
        { title: 'Popover', link: '/kit/popover' },
      ],
      'title'
    ),
  };

  private readonly dndGroup: LinksGroup = {
    title: 'Drag&drop',
    linkItems: sortByProperty([{ title: 'Drag&drop', link: '/kit/dnd' }], 'title'),
  };

  private readonly demoToolsGroup: LinksGroup = {
    title: 'Demo Tools',
    linkItems: sortByProperty(
      [
        { title: 'Code', link: '/kit/code' },
        { title: 'Info block', link: '/kit/info-block' },
      ],
      'title'
    ),
  };

  private readonly linkGroups: LinksGroup[] = [
    this.commonGroup,
    this.iconsGroup,
    this.kitGroup,
    this.formsGroup,
    this.overlaysGroup,
    this.tableGroup,
    this.treeGroup,
    this.widgetsGroup,
    this.dndGroup,
    this.demoToolsGroup,
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

  constructor(@Inject(DrawerRef) @Optional() private readonly drawerRef: DrawerRef<number>) {}

  public handleClickLink(): void {
    this.closeSidebar();
  }

  public closeSidebar(): void {
    if (this.isOpenInDrawer) {
      this.drawerRef.close();
    }
  }
}
