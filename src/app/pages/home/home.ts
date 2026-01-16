import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import {
  EstatisticasResumo,
  EstatisticasService,
  EstatisticasStatusGeral,
  UltimaMovimentacao
} from '@/core/services/estatisticas-service';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartModule, UIChart } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { lastValueFrom } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-home',
  imports: [CardModule, TableModule, DatePipe, ChartModule, SkeletonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  @ViewChild('faixaAtrasoChart') faixaAtrasoChart!: UIChart;
  @ViewChild('clientesChart') clientesChart!: UIChart;
  @ViewChild('statusChart') statusChart!: UIChart;

  loading = {
    resumo: false,
    pendencias_por_cliente: false,
    pendencias_por_material: false,
    status_geral: false,
    ultimas_movimentacoes: false,
    pendencias_por_faixa: false
  };

  /** LINHA 1 — RESUMO */
  resumo!: EstatisticasResumo;
  /** LINHA 3 — STATUS GERAL */
  statusGeral!: EstatisticasStatusGeral;
  statusGeralChart: any;
  statusGeralOptions: any;
  /** LINHA 3 — MATERIAIS COM MAIOR DÉBITO */
  materiaisDebitoChart: any;
  /** LINHA 4 — CLIENTES COM MAIOR PENDÊNCIA */
  clientesPendenciaChart!: ChartData;
  clientesPendenciaOptions!: ChartOptions;
  /** LINHA 5 — ÚLTIMAS MOVIMENTAÇÕES */
  ultimasMovimentacoes: UltimaMovimentacao[] = [];

  pendenciasFaixaChart: any;
  pendenciasFaixaOptions: any;

  private readonly estatisticasService = inject(EstatisticasService);

  ngOnInit(): void {
    void this.loadDashboard();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.resizeCharts();
  }

  private async loadDashboard(): Promise<void> {
    const steps: Array<() => Promise<void>> = [
      this.loadResumo,
      this.loadStatusGeral,
      this.loadClientesMaiorPendencia,
      this.loadPendenciasPorFaixa,
      this.loadUltimasMovimentacoes
    ];

    for (const step of steps) {
      await step.call(this);
    }

    this.resizeCharts();
  }

  /* ===============================
   * LINHA 1 — RESUMO
   =============================== */
  private async loadResumo(): Promise<void> {
    this.loading.resumo = true;
    try {
      this.resumo = await lastValueFrom(this.estatisticasService.resumo());
    } finally {
      this.loading.resumo = false;
    }
  }

  /* ===============================
   * LINHA 3 — STATUS GERAL
   =============================== */
  private async loadStatusGeral(): Promise<void> {
    this.loading.status_geral = true;

    try {
      const res = await lastValueFrom(this.estatisticasService.statusGeral());

      this.statusGeral = res;

      this.statusGeralChart = {
        labels: ['Pendentes', 'Quitadas'],
        datasets: [
          {
            data: [res.pendentes, res.quitadas],
            backgroundColor: ['#f91616', '#22c55e'],
            hoverBackgroundColor: ['#dc4747', '#4ade80']
          }
        ]
      };

      this.statusGeralOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const percent = ((ctx.raw / res.total_notas) * 100).toFixed(1);
                return `${ctx.raw} (${percent}%)`;
              }
            }
          }
        }
      };
    } finally {
      this.loading.status_geral = false;
    }
  }

  /* ===============================
   * LINHA 3 — MATERIAIS COM MAIOR DÉBITO
   =============================== */
  private loadMateriaisMaiorDebito(): void {
    this.loading.pendencias_por_material = true;

    this.estatisticasService.materiaisComMaiorDebito().subscribe({
      next: (dados) => {
        this.materiaisDebitoChart = {
          labels: dados.map((m) => m.material_id),
          datasets: [
            {
              label: 'Débito Total',
              data: dados.map((m) => m.debito_total)
            }
          ]
        };
      },
      complete: () => {
        this.loading.pendencias_por_material = false;
        this.resizeCharts();
      },
      error: () => (this.loading.pendencias_por_material = false)
    });
  }

  /* ===============================
   * LINHA 4 — CLIENTES COM MAIOR PENDÊNCIA
   =============================== */
  private async loadClientesMaiorPendencia(): Promise<void> {
    this.loading.pendencias_por_cliente = true;

    try {
      const grafico = await lastValueFrom(this.estatisticasService.clientesComMaiorPendencia());

      this.clientesPendenciaChart = {
        labels: grafico.labels,
        datasets: [
          {
            label: 'Saldo Devedor',
            data: grafico.values,
            backgroundColor: 'rgba(0,119,255,0.3)',
            borderColor: 'rgba(0,119,255,1)',
            borderWidth: 1
          }
        ]
      };

      this.clientesPendenciaOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items: any[]) => grafico.labels[items[0].dataIndex],
              label: (item: any) => `Saldo devedor: ${item.raw}`
            }
          }
        },
        scales: {
          x: { display: false },
          y: { beginAtZero: true, ticks: { precision: 0 }, max: Math.ceil(Math.max(...grafico.values) * 1.1) }
        }
      };
    } finally {
      this.loading.pendencias_por_cliente = false;
    }
  }

  /* ===============================
   * LINHA 5 — ÚLTIMAS MOVIMENTAÇÕES
   =============================== */
  private async loadUltimasMovimentacoes(): Promise<void> {
    this.loading.ultimas_movimentacoes = true;

    try {
      this.ultimasMovimentacoes = await lastValueFrom(this.estatisticasService.ultimasMovimentacoes());
    } finally {
      this.loading.ultimas_movimentacoes = false;
    }
  }

  private async loadPendenciasPorFaixa(): Promise<void> {
    this.loading.pendencias_por_faixa = true;

    try {
      const grafico = await lastValueFrom(this.estatisticasService.notasPendentesPorFaixa());

      const coresPorFaixa: Record<string, string> = {
        '30-60 dias': '#3b82f6',
        '61-90 dias': '#facc15',
        '91-120 dias': '#f97316',
        '+120 dias': '#dc2626'
      };

      this.pendenciasFaixaChart = {
        labels: grafico.labels,
        datasets: [
          {
            label: 'Notas Pendentes',
            data: grafico.values,
            backgroundColor: grafico.labels.map((l) => coresPorFaixa[l] ?? '#9ca3af')
          }
        ]
      };

      this.pendenciasFaixaOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 }, max: Math.ceil(Math.max(...grafico.values) * 1.30) }
        }
      };
    } finally {
      this.loading.pendencias_por_faixa = false;
    }
  }

  private resizeCharts(): void {
    // timeout pequeno garante que o DOM já foi recalculado
    setTimeout(() => {
      console.log(this.faixaAtrasoChart?.chart);
      this.faixaAtrasoChart?.chart?.resize();
      this.clientesChart?.chart?.resize();
      this.statusChart?.chart?.resize();
    }, 50);
  }
}
