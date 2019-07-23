import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WasherPanelComponent } from './washer-panel.component';

describe('WasherPanelComponent', () => {
  let component: WasherPanelComponent;
  let fixture: ComponentFixture<WasherPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WasherPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WasherPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
