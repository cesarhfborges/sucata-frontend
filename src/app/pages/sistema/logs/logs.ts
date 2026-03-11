import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Card } from 'primeng/card';
import { LogEntry, LogFile, LogsService } from '@/core/services/logs.service';
import { TreeNode } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { HighlightModule } from 'ngx-highlightjs';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-logs',
  imports: [FormsModule, SelectModule, ButtonModule, TreeTableModule, FieldsetModule, DialogModule, JsonPipe, Card, TitleCasePipe, TagModule, HighlightModule, PanelModule],
  templateUrl: './logs.html',
  styleUrl: './logs.scss'
})
export class Logs implements OnInit {
  arquivos: LogFile[] = [];
  arquivoSelecionado?: LogFile;

  loading = false;
  treeNodes: TreeNode[] = [];

  dialogVisible = false;
  logSelecionado?: LogEntry;

  private readonly _logsService = inject(LogsService);

  constructor() {}

  ngOnInit(): void {
    this.carregarArquivos();
  }

  carregarArquivos(): void {
    this._logsService.listarArquivos().subscribe({
      next: (data) => (this.arquivos = data)
    });
  }

  abrirDialog(log: LogEntry): void {
    this.logSelecionado = {
      ...log,
      body: log.body ? JSON.parse(log.body) : null
    };
    this.dialogVisible = true;
  }

  onSelecionarArquivo(): void {
    if (!this.arquivoSelecionado) return;

    this.loading = true;
    this.treeNodes = [];

    this._logsService.obterPorData(this.arquivoSelecionado.date).subscribe({
      next: (response) => {
        this.treeNodes = this.mapearParaTreeTable(response.entries);
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  protected limpar() {
    this.treeNodes = [];
  }

  private mapearParaTreeTable(entries: LogEntry[]): TreeNode[] {
    return entries.map((entry, index, entries) => ({
      key: index.toString(),
      data: {
        id: entries.length - index,
        timestamp: entry.timestamp,
        environment: entry.environment,
        level: entry.level,
        _original: entry
      }
    }));
  }
}
