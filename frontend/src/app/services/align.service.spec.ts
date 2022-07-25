import { TestBed } from '@angular/core/testing';

import { AlignService } from './align.service';

describe('AlignService', () => {
  let service: AlignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
