import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamSelectionComponent } from './stream-selection.component';

describe('StreamSelectionComponent', () => {
  let component: StreamSelectionComponent;
  let fixture: ComponentFixture<StreamSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
