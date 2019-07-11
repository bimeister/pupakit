import { TestBed } from '@angular/core/testing';

import { PupakitService } from './pupakit.service';

describe('PupakitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PupakitService = TestBed.get(PupakitService);
    expect(service).toBeTruthy();
  });
});
