import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroNotaFiscalItem } from './cadastro-nota-fiscal-item';

describe('CadastroNotaFiscalItem', () => {
  let component: CadastroNotaFiscalItem;
  let fixture: ComponentFixture<CadastroNotaFiscalItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroNotaFiscalItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroNotaFiscalItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
