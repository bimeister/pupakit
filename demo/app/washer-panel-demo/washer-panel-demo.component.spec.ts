import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WasherPanelDemoComponent } from './washer-panel-demo.component';

describe('WasherPanelDemoComponent', () => {
  let component: WasherPanelDemoComponent;
  let fixture: ComponentFixture<WasherPanelDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WasherPanelDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WasherPanelDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
