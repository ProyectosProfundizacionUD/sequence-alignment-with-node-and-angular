import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSequencesComponent } from './list-sequences.component';

describe('ListSequencesComponent', () => {
  let component: ListSequencesComponent;
  let fixture: ComponentFixture<ListSequencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSequencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSequencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
