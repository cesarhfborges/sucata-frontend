import { Component } from '@angular/core';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { Button, ButtonModule } from 'primeng/button';
import { RouterLink, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-not-found',
  imports: [ButtonModule, RippleModule, RouterModule, AppFloatingConfigurator, ButtonModule, NgOptimizedImage],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFound {}
