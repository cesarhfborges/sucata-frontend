import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosListar } from './usuarios-listar';

describe('UsuariosListar', () => {
  let component: UsuariosListar;
  let fixture: ComponentFixture<UsuariosListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
