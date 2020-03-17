import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInfoDialogComponent } from './client-info-dialog.component';

describe('ClientInfoDialogComponent', () => {
  let component: ClientInfoDialogComponent;
  let fixture: ComponentFixture<ClientInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
