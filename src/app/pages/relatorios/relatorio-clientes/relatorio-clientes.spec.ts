import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioClientes } from '@/pages/relatorios';

describe('RelatorioClientes', () => {
  let component: RelatorioClientes;
  let fixture: ComponentFixture<RelatorioClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioClientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioClientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
