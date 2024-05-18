import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastermessageComponent } from './toastermessage.component';

describe('ToastermessageComponent', () => {
  let component: ToastermessageComponent;
  let fixture: ComponentFixture<ToastermessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastermessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastermessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
