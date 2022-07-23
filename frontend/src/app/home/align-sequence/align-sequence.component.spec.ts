import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignSequenceComponent } from './align-sequence.component';

describe('AlignSequenceComponent', () => {
  let component: AlignSequenceComponent;
  let fixture: ComponentFixture<AlignSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlignSequenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
