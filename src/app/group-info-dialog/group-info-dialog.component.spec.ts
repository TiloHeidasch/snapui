import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInfoDialogComponent } from './group-info-dialog.component';

describe('GroupInfoDialogComponent', () => {
  let component: GroupInfoDialogComponent;
  let fixture: ComponentFixture<GroupInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
