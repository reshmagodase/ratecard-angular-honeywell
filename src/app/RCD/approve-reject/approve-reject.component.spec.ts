import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectComponent } from './approve-reject.component';

describe('ApproveRejectComponent', () => {
  let component: ApproveRejectComponent;
  let fixture: ComponentFixture<ApproveRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
