import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { fakerPT_BR } from '@faker-js/faker';
import { RouterLink } from '@angular/router';

interface Usuario {
  id?: number;
  nome: string;
  sobrenome: string;
  email: string;
  ult_acesso: Date;
  senha?: string;
  ativo: boolean;
}

@Component({
  selector: 'app-usuarios-listar',
  imports: [TableModule, CardModule, Tag, DatePipe, Button, ButtonGroup, RouterLink],
  templateUrl: './usuarios-listar.html',
  styleUrl: './usuarios-listar.scss'
})
export class UsuariosListar {
  protected tableConfig = {
    rows: 10,
    rowsPerPageOptions: [10, 25, 50]
  };

  protected usuarios: Usuario[] = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    nome: fakerPT_BR.person.firstName(),
    sobrenome: fakerPT_BR.person.lastName(),
    email: fakerPT_BR.internet.email(),
    ativo: fakerPT_BR.datatype.boolean(),
    ult_acesso: fakerPT_BR.date.anytime()
  }));
  //   [
  //   {
  //     id: 1,
  //     nome: 'Cesar',
  //     sobrenome: 'Borges',
  //     email: 'teste@teste',
  //     ult_acesso: new Date(),
  //     ativo: true
  //   }
  // ];
}
