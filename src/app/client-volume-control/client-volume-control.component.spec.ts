import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVolumeControlComponent } from './client-volume-control.component';

describe('ClientVolumeControlComponent', () => {
  let component: ClientVolumeControlComponent;
  let fixture: ComponentFixture<ClientVolumeControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientVolumeControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientVolumeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
