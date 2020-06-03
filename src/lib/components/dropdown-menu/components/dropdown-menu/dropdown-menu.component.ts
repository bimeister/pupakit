import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Input
} from '@angular/core';
import { Subject } from 'rxjs';

import { DroppableLegacyHorizontalPosition } from '../../../../../internal/declarations/types/droppable-legacy-horizontal-position.type';
import { DropdownMenuContentComponent } from '../dropdown-menu-content/dropdown-menu-content.component';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuTriggerComponent } from '../dropdown-menu-trigger/dropdown-menu-trigger.component';

@Component({
  selector: 'pupa-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['dropdown-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuComponent implements AfterContentInit {
  public readonly onItemClicked$: Subject<DropdownMenuItemComponent> = new Subject<DropdownMenuItemComponent>();

  @Input()
  public contentSide: DroppableLegacyHorizontalPosition = 'right';

  @ContentChild(DropdownMenuTriggerComponent)
  private readonly trigger: DropdownMenuTriggerComponent;
  @ContentChild(DropdownMenuContentComponent)
  private readonly content: DropdownMenuContentComponent;

  private isContentVisible: boolean = false;

  constructor(private readonly hostElement: ElementRef) {}

  @HostListener('window:click', ['$event'])
  public windowClick(event: MouseEvent): void {
    const clickOutside: boolean = !(this.hostElement.nativeElement as HTMLElement).contains(event.target as Node);
    if (clickOutside) {
      this.setContentVisible(false);
    }
  }
  public ngAfterContentInit(): void {
    this.trigger.onClick$.subscribe(this.handleTriggerClick.bind(this));

    this.content.setVisibleState(this.isContentVisible);
    this.content.onItemClick$.subscribe(this.handleItemClick.bind(this));

    this.content.isLeftSided = this.contentSide === 'left';
  }

  public setContentVisible(visible: boolean): void {
    this.isContentVisible = visible;
    this.content.setVisibleState(visible);
  }
  public switchContentVisible(): void {
    this.setContentVisible(!this.isContentVisible);
  }

  private handleTriggerClick(): void {
    this.switchContentVisible();
  }
  private handleItemClick(item: DropdownMenuItemComponent): void {
    this.setContentVisible(false);
    this.onItemClicked$.next(item);
  }
}
