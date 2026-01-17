import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [DatePipe],
  templateUrl: './app.footer.html'
})
export class AppFooter {
  dateNow: Date = new Date();
}
