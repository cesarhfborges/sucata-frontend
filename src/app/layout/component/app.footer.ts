import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  template: `<div class="layout-footer">
    Todos os direitos reservados a
    <a href="https://platoflex.com.br" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Platoflex embreagens</a>©
    <div
      class="fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs font-bold text-white shadow-2xl opacity-80 hover:opacity-100 transition-opacity"
    >
      <span class="block sm:hidden text-yellow-400">DEFAULT (XS)</span>

      <span class="hidden sm:block md:hidden text-blue-400">SM (~640px)</span>

      <span class="hidden md:block lg:hidden text-green-400">MD (~768px)</span>

      <span class="hidden lg:block xl:hidden text-purple-400">LG (~1024px)</span>

      <span class="hidden xl:block 2xl:hidden text-pink-400">XL (~1280px)</span>

      <span class="hidden 2xl:block text-red-400">2XL (>1536px)</span>
    </div>
  </div>`
})
export class AppFooter {}
