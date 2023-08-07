import { Optional, SkipSelf, type FactoryProvider } from '@angular/core';
import { type Repeated } from '@bimeister/utilities';

/**
 * @description Creates provider if it doesn't exist in parent injectors.
 *
 * @param target
 * is target searchable in injectors trees dependency
 *
 * @param dependencies
 * is dependencies of target.
 * Type automatically calculates count of array elements by count of target constructor arguments.
 * [unknown, unknown, ..., unknown]
 *
 * @example // Takes existing dependency:
 *
 * /@Component({
 *  template: `<app-target></app-target>`
 *  providers: [Dependency1],
 * })
 * class WithProviderComponent {}
 *
 * /@Component({
 *  providers: [createProviderIfMissing(Dependency1)]
 * })
 * class TargetComponent {
 *  constructor(private readonly dependency1: Dependency1) {} // takes dependency instance from WithProviderComponent
 * }
 *
 * @example // Creates new dependency:
 *
 * /@Component({
 *  template: `<app-target></app-target>`
 * })
 * class withoutProviderComponent {}
 *
 * /@Component({
 *  providers: [createProviderIfMissing(Dependency1)]
 * })
 * class TargetComponent {
 * constructor(private readonly dependency1: Dependency1) {} // creates new dependency instance
 */
export function createProviderIfMissing<T extends new (...args: unknown[]) => unknown>(
  target: T,
  dependencies: Repeated<unknown, ConstructorParameters<T>['length']>
): FactoryProvider {
  return {
    provide: target,
    useFactory: (existingDependency?: T, ...dependencyInstancies: unknown[]) =>
      existingDependency ?? new target(...dependencyInstancies),
    deps: [[target, new Optional(), new SkipSelf()], ...dependencies],
  };
}
