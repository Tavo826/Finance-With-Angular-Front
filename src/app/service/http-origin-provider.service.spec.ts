import { TestBed } from '@angular/core/testing';

import { HttpOriginProviderService } from './http-origin-provider.service';

describe('HttpOriginProviderService', () => {
  let service: HttpOriginProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpOriginProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
