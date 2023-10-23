import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { filterNotNil, filterTruthy } from '@bimeister/utilities';
import { AccordionComponent } from '../accordion/accordion.component';
import { merge, Observable, Subscription } from 'rxjs';
import { filter, map, mapTo, pairwise, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'pupa-accordion-group',
  templateUrl: './accordion-group.component.html',
  styleUrls: ['./accordion-group.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionGroupComponent implements OnDestroy, AfterContentInit {
  @Input() public closeOthers: boolean = true;

  @ContentChildren(AccordionComponent) public readonly accordionList: QueryList<AccordionComponent>;

  private readonly subscription: Subscription = new Subscription();

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public ngAfterContentInit(): void {
    this.subscription.add(this.processCloseOthers());
  }

  private processCloseOthers(): Subscription {
    const accordionList$: Observable<AccordionComponent[]> = this.accordionList.changes.pipe(
      map((accordion: QueryList<AccordionComponent>) => accordion.toArray()),
      startWith(this.accordionList.toArray())
    );

    const justAddedAccordionExpanded$: Observable<AccordionComponent> = accordionList$.pipe(
      pairwise(),
      map(([previousAccordionList, currentAccordionList]: [AccordionComponent[], AccordionComponent[]]) =>
        currentAccordionList.find(
          (accordion: AccordionComponent) => !previousAccordionList.includes(accordion) && accordion.expanded
        )
      ),
      filterNotNil()
    );

    const existingAccordionExpanded$: Observable<AccordionComponent> = accordionList$.pipe(
      switchMap((accordionList: AccordionComponent[]) =>
        merge(
          ...accordionList.map((accordion: AccordionComponent) =>
            accordion.expanded$.pipe(filterTruthy(), mapTo(accordion))
          )
        )
      )
    );

    return merge(justAddedAccordionExpanded$, existingAccordionExpanded$)
      .pipe(filter(() => this.closeOthers))
      .subscribe((expandedAccordion: AccordionComponent) => {
        this.accordionList.forEach((accordion: AccordionComponent) => {
          if (expandedAccordion !== accordion && accordion.expanded) {
            accordion.collapse();
          }
        });
      });
  }
}
