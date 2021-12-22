import {
  AfterContentInit,
  Directive,
  OnChanges,
  OnDestroy,
  QueryList,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { ContentTemplateNameDirective } from '../../interfaces/content-template-name.interface';
import { TabTemplateRef } from '../../interfaces/tab-template-ref.interface';
import { TabsServiceBase } from './tabs-service-base.abstract';

@Directive()
export abstract class TabsContentBase<T, S extends TabsServiceBase<T>>
  implements OnChanges, AfterContentInit, OnDestroy
{
  protected readonly subscription: Subscription = new Subscription();

  public abstract destroyable: boolean;
  protected readonly destroyable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public abstract tabTemplates: QueryList<ContentTemplateNameDirective<T>>;

  protected readonly activeTabName$: Observable<T> = this.stateService.activeTabName$.pipe(filterNotNil());

  public readonly activeTemplateRef$: BehaviorSubject<Nullable<TemplateRef<unknown>>> = new BehaviorSubject<
    Nullable<TemplateRef<unknown>>
  >(null);
  public readonly nonDestroyableTemplateRefs$: BehaviorSubject<TabTemplateRef<T>[]> = new BehaviorSubject<
    TabTemplateRef<T>[]
  >([]);

  constructor(protected readonly stateService: S) {}

  public readonly tabTrackBy: TrackByFunction<TabTemplateRef<T>> = (index: number) => index;

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processInputDestroyableChanges(changes.destroyable?.currentValue);
  }

  public ngAfterContentInit(): void {
    this.subscription.add(this.processActiveTabChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processInputDestroyableChanges(destroyable: Nullable<boolean>): void {
    if (isNil(destroyable)) {
      return;
    }

    this.destroyable$.next(destroyable);
  }

  private processActiveTabChanges(): Subscription {
    return combineLatest([this.destroyable$, this.activeTabName$]).subscribe(
      ([destroyable, activeTabName]: [boolean, T]) => {
        if (destroyable) {
          const targetTemplate: ContentTemplateNameDirective<T> = this.tabTemplates.find(
            (template: ContentTemplateNameDirective<T>) => template.getTemplateName() === activeTabName
          );
          this.activeTemplateRef$.next(targetTemplate.templateRef);
          return;
        }

        const templates: TabTemplateRef<T>[] = this.tabTemplates.map((template: ContentTemplateNameDirective<T>) => ({
          templateRef: template.templateRef,
          name: template.getTemplateName(),
          isActive: template.getTemplateName() === activeTabName,
        }));

        this.nonDestroyableTemplateRefs$.next(templates);
      }
    );
  }
}
