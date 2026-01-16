import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { JsonPipe, NgClass, TitleCasePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Card } from 'primeng/card';
import { LogEntry, LogFile, LogsService } from '@/core/services/logs.service';
import { TreeNode } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'app-logs',
  imports: [FormsModule, SelectModule, ButtonModule, TreeTableModule, NgClass, DialogModule, JsonPipe, Card, TitleCasePipe, TagModule, HighlightModule],
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

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.carregarArquivos();
  }

  carregarArquivos(): void {
    this.logsService.listarArquivos().subscribe({
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

    this.logsService.obterPorData(this.arquivoSelecionado.date).subscribe({
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
    return entries.map((entry, index) => ({
      key: index.toString(),
      data: {
        timestamp: entry.timestamp,
        environment: entry.environment,
        level: entry.level,
        _original: entry
      }
    }));
  }
}
