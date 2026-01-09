import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesListar } from './clientes-listar';

describe('ClientesListar', () => {
  let component: ClientesListar;
  let fixture: ComponentFixture<ClientesListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
