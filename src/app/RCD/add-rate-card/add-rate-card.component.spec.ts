import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRateCardComponent } from './add-rate-card.component';

describe('AddRateCardComponent', () => {
  let component: AddRateCardComponent;
  let fixture: ComponentFixture<AddRateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRateCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
