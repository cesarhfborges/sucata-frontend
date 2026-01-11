import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroNotaFiscal } from './cadastro-nota-fiscal';

describe('CadastroNotaFiscal', () => {
  let component: CadastroNotaFiscal;
  let fixture: ComponentFixture<CadastroNotaFiscal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroNotaFiscal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroNotaFiscal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
