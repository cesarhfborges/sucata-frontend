import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { environment } from './environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isProduction = environment.production;

  width: number = 0;
  height: number = 0;

  ngOnInit(): void {
    this.updateResolution();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateResolution();
  }

  private updateResolution(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
}
