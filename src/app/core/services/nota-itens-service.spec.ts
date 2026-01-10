import { TestBed } from '@angular/core/testing';

import { NotaItensService } from './nota-itens-service';

describe('NotaItensService', () => {
  let service: NotaItensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotaItensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
