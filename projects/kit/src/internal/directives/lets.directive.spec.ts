import { CommonModule, JsonPipe } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestBedStatic, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, from } from 'rxjs';
import { take } from 'rxjs/operators';
import { LetDirective } from './let.directive';

@Component({
  template: `
    <div *pupaLet="{ id: id$ | async, name: name$ | async } as groupedVariables; let id = id; let name = name">
      <div id="name">{{ name }}</div>
      <div id="id">{{ id }}</div>
      <div id="grouped">{{ groupedVariables | json }}</div>
    </div>
  `,
})
class TestComponent {
  public readonly id$: BehaviorSubject<string> = new BehaviorSubject<string>('123456FAKE_ID');
  public readonly name$: BehaviorSubject<string> = new BehaviorSubject<string>('FAKE_NAME');
}

describe('lets.directive.ts', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let testBedStatic: TestBedStatic;

  beforeEach(() => {
    testBedStatic = TestBed.configureTestingModule({
      declarations: [TestComponent, LetDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [JsonPipe],
      imports: [CommonModule],
    });
  });

  beforeEach(waitForAsync(() => {
    from(testBedStatic.compileComponents())
      .pipe(take(1))
      .subscribe(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
      });
  }));

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should allow to declare variables by name and use in the template', waitForAsync(() => {
    const idTextContent: string = fixture.debugElement.query(By.css('#id')).nativeElement.textContent;
    const nameTextContent: string = fixture.debugElement.query(By.css('#name')).nativeElement.textContent;

    combineLatest([component.id$, component.name$])
      .pipe(take(1))
      .subscribe(([idText, nameText]: [string, string]) => {
        expect(idTextContent).toContain(idText);
        expect(nameTextContent).toContain(nameText);
      });
  }));

  it('should allow to declare variable by "as" syntax and use in the template', waitForAsync(() => {
    const jsonPipe: JsonPipe = testBedStatic.inject(JsonPipe);
    const groupedVariablesJson: string = fixture.debugElement.query(By.css('#grouped')).nativeElement.textContent;

    combineLatest([component.id$, component.name$])
      .pipe(take(1))
      .subscribe(([id, name]: [string, string]) => {
        expect(groupedVariablesJson).toContain(jsonPipe.transform({ id, name }));
      });
  }));
});
