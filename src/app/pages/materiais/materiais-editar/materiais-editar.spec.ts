import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaisEditar } from './materiais-editar';

describe('MateriaisEditar', () => {
  let component: MateriaisEditar;
  let fixture: ComponentFixture<MateriaisEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriaisEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriaisEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
