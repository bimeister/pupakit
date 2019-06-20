import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PupakitComponent } from './pupakit.component';

describe('PupakitComponent', () => {
  let component: PupakitComponent;
  let fixture: ComponentFixture<PupakitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PupakitComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PupakitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
