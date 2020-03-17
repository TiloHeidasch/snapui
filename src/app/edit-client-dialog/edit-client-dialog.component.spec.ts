import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientDialogComponent } from './edit-client-dialog.component';

describe('EditClientDialogComponent', () => {
  let component: EditClientDialogComponent;
  let fixture: ComponentFixture<EditClientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClientDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
