import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  template: `<div class="layout-footer">
    Todos os direitos reservados a
    <a href="https://platoflex.com.br" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Platoflex embreagens</a>©
  </div>`
})
export class AppFooter {}
