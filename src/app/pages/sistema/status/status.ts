import { Component, inject, OnInit } from '@angular/core';
import { LogsService } from '@/core/services/logs.service';
import { Card } from 'primeng/card';
import { DatePipe, JsonPipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { TreeTableModule } from 'primeng/treetable';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';

interface IStatus {
  name: string;
  version: string;
  php: string;
  server: 'ok' | 'degraded';
  checks: {
    app: 'up' | 'down';
    database: 'up' | 'down';
    cache: 'up' | 'down';
    queue: 'up' | 'down';
    disk: 'up' | 'down';
    memory: 'up' | 'down';
    env: 'up' | 'down';
    php: 'up' | 'down';
  };
  timestamp: Date;
  errors?: null;
}

@Component({
  selector: 'app-status',
  imports: [Card, JsonPipe, Tag, TitleCasePipe, TreeTableModule, NgxLoaderIndicatorDirective, KeyValuePipe, DatePipe],
  templateUrl: './status.html',
  styleUrl: './status.scss'
})
export class Status implements OnInit {
  loading: boolean = false;

  status?: IStatus;

  private readonly _logsService = inject(LogsService);

  ngOnInit(): void {
    this.loading = true;
    this._logsService.status().subscribe({
      next: (response) => {
        console.log(response);
        this.status = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
