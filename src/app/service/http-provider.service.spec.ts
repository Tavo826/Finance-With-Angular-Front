import { TestBed } from '@angular/core/testing';

import { HttpTransactionProviderService } from './http-transaction-provider.service';

describe('HttpProviderService', () => {
  let service: HttpTransactionProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpTransactionProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
