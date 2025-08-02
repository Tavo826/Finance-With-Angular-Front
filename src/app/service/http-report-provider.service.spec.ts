import { TestBed } from '@angular/core/testing';

import { HttpReportProviderService } from './http-report-provider.service';

describe('HttpReportProviderService', () => {
  let service: HttpReportProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpReportProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
