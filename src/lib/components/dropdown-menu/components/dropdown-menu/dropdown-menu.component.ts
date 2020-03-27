import {
  Component,
  AfterContentInit,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
  ContentChild
} from '@angular/core';
import { DropdownMenuTriggerComponent } from '../dropdown-menu-trigger/dropdown-menu-trigger.component';
import { DropdownMenuContentComponent } from '../dropdown-menu-content/dropdown-menu-content.component';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'pupa-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuComponent implements AfterContentInit {
  public readonly onItemClicked$: Subject<DropdownMenuItemComponent> = new Subject<DropdownMenuItemComponent>();

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
