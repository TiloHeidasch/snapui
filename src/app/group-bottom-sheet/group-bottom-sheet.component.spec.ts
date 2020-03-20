import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBottomSheetComponent } from './group-bottom-sheet.component';

describe('GroupBottomSheetComponent', () => {
  let component: GroupBottomSheetComponent;
  let fixture: ComponentFixture<GroupBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
