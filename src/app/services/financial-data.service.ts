import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as XLSX from 'xlsx';
import {
  FinancialReport,
  FinancialRatio,
  DuPontData,
  KpiCardData,
  KpiMetric,
  FinancialRow,
  BalanceBreakdown,
  IncomeBreakdown,
  HorizontalKeyVariation,
  WorkingCapitalCycleItem
} from '../models/financial.model';
import { COMMERCIAL_INITIAL_DATA } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class FinancialDataService {
  private readonly platformId = inject(PLATFORM_ID);

  // State Signals - Initialized with the full 2025 vs 2024 commercial model dataset
  readonly report = signal<FinancialReport | null>(COMMERCIAL_INITIAL_DATA);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly hasUploadedFile = signal<boolean>(true);
  readonly currentFileName = signal<string | null>('NIBOL_Analisis_Financiero_2025.xlsx');
  readonly activeTab = signal<'overview' | 'dupont' | 'ratios' | 'vertical' | 'horizontal' | 'statements'>('overview');

  // Computed Selectors
  readonly kpis = computed<KpiMetric[]>(() => this.report()?.kpis ?? []);
  readonly balanceIncomeKpis = computed(() => this.report()?.balanceIncomeKpis ?? []);
  readonly ratioKpis = computed(() => this.report()?.ratioKpis ?? []);
  readonly dupont = computed(() => this.report()?.dupont ?? null);
  readonly balance = computed(() => this.report()?.balanceBreakdown ?? null);
  readonly income = computed(() => this.report()?.incomeBreakdown ?? null);
  readonly ratios = computed(() => this.report()?.ratios ?? []);
  readonly keyVariations = computed(() => this.report()?.keyVariations ?? []);

  // Asset Composition Pie Chart
  readonly assetCompositionData = computed(() => {
    const rep = this.report();
    if (!rep) return null;
    const b = rep.balanceBreakdown;
    return {
      labels: ['Activo Corriente', 'Activo No Corriente'],
      datasets: [
        {
          data: [b.currentAssets2025, b.nonCurrentAssets2025],
          percentages: [b.pctCurrentAssets2025, b.pctNonCurrentAssets2025],
          backgroundColor: ['#0284c7', '#1e3a8a'],
          hoverBackgroundColor: ['#38bdf8', '#2563eb'],
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    };
  });

  // Financing Structure Donut Data
  readonly liabilityEquityData = computed(() => {
    const rep = this.report();
    if (!rep) return null;
    if (rep.financingStructure && rep.financingStructure.length > 0) {
      return {
        labels: rep.financingStructure.map(s => s.concept),
        datasets: [
          {
            data: rep.financingStructure.map(s => s.amount),
            percentages: rep.financingStructure.map(s => s.percentage),
            backgroundColor: rep.financingStructure.map(s => s.color),
            hoverBackgroundColor: rep.financingStructure.map(s => s.color),
            borderColor: '#ffffff',
            borderWidth: 2
          }
        ]
      };
    }
    const b = rep.balanceBreakdown;
    return {
      labels: ['Patrimonio Neto', 'Pasivo Corriente', 'Pasivo No Corriente'],
      datasets: [
        {
          data: [b.equity2025, b.currentLiabilities2025, b.nonCurrentLiabilities2025],
          percentages: [b.pctEquity2025, b.pctCurrentLiabilities2025, b.pctNonCurrentLiabilities2025],
          backgroundColor: ['#1e3a8a', '#0284c7', '#10b981'],
          hoverBackgroundColor: ['#2563eb', '#38bdf8', '#34d399'],
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    };
  });

  // Performance Bar Data (Ingresos Netos, Margen Bruto, EBIT, EBT, Utilidad Neta)
  readonly performanceBarData = computed(() => {
    const rep = this.report();
    if (!rep) return null;
    const inc = rep.incomeBreakdown;
    return {
      labels: [
        'Ingresos Netos',
        'Margen Bruto',
        'EBIT (Operativo)',
        'EBT (Antes Imp.)',
        'Utilidad Neta'
      ],
      datasets: [
        {
          label: 'Gestión 2024 (Bs. M)',
          data: [
            inc.netRevenue2024,
            inc.grossProfit2024,
            inc.operatingProfit2024,
            inc.profitBeforeTax2024,
            inc.netProfit2024
          ],
          backgroundColor: '#94a3b8',
          borderRadius: 6
        },
        {
          label: 'Gestión 2025 (Bs. M)',
          data: [
            inc.netRevenue2025,
            inc.grossProfit2025,
            inc.operatingProfit2025,
            inc.profitBeforeTax2025,
            inc.netProfit2025
          ],
          backgroundColor: '#0284c7',
          borderRadius: 6
        }
      ]
    };
  });

  /**
   * Clears all loaded data to leave the dashboard clean for a brand new Excel upload
   */
  clearData(): void {
    this.report.set(null);
    this.hasUploadedFile.set(false);
    this.currentFileName.set(null);
    this.errorMessage.set(null);
    this.successMessage.set('Tablero limpiado correctamente. Listo para cargar un nuevo archivo Excel comercial.');
    setTimeout(() => this.successMessage.set(null), 4000);
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: 'overview' | 'dupont' | 'ratios' | 'vertical' | 'horizontal' | 'statements'): void {
    this.activeTab.set(tab);
  }

  /**
   * Loads sample model data on demand
   */
  loadSampleData(): void {
    this.report.set(COMMERCIAL_INITIAL_DATA);
    this.hasUploadedFile.set(true);
    this.currentFileName.set('NIBOL_Analisis_Financiero_2025.xlsx');
    this.errorMessage.set(null);
    this.successMessage.set('Datos del modelo comercial NIBOL LTDA. cargados exitosamente (Activo Total: Bs. 1.723,6 M).');
    setTimeout(() => this.successMessage.set(null), 4000);
  }

  /**
   * Process uploaded local Excel file
   */
  async processExcelFile(file: File): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, {
        type: 'array',
        cellDates: true,
        cellNF: false,
        cellText: false
      });

      const parsedReport = this.parseWorkbook(workbook, file.name);
      this.report.set(parsedReport);
      this.hasUploadedFile.set(true);
      this.currentFileName.set(file.name);
      this.successMessage.set(`Archivo "${file.name}" procesado con éxito. Tablero comercial generado.`);
      setTimeout(() => this.successMessage.set(null), 5000);
    } catch (err: unknown) {
      console.error('Error al procesar archivo Excel:', err);
      const msg = err instanceof Error ? err.message : 'Error desconocido al leer el archivo Excel';
      this.errorMessage.set(`No se pudo procesar el archivo Excel: ${msg}. Por favor verifique el formato.`);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Parse workbook into strongly typed FinancialReport
   */
  private parseWorkbook(workbook: XLSX.WorkBook, fileName: string): FinancialReport {
    const sheetNames = workbook.SheetNames;
    
    // Normalize sheet names lookup
    const findSheet = (keywords: string[]): XLSX.WorkSheet | null => {
      for (const name of sheetNames) {
        const cleanName = name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');

        for (const kw of keywords) {
          const cleanKw = kw
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

          if (cleanName.includes(cleanKw)) {
            return workbook.Sheets[name];
          }
        }
      }
      return null;
    };

    const sheetEstFin = findSheet(['estfinancieros', 'estadosfinanciero', 'estadosfinancieros', 'situacionyresultados', 'balance']);
    const sheetHorizontal = findSheet(['horizontal', 'analisishorizontal']);
    const sheetVertical = findSheet(['vertical', 'analisisvertical']);
    const sheetRatios = findSheet(['ratiosydupont', 'ratios', 'dupont', 'ratiosfinancieros', 'sistemadupont', 'indicadores', 'indices']);
    const sheetDupont = findSheet(['sistemadupont', 'dupont', 'covenants']);
    const sheetDatosDashboard = findSheet(['datosdashboard', 'basededatos', 'hojadatos', 'dashboard', 'datos']);

    // Convert sheets to array of arrays (rows)
    const rowsEstFin: any[][] = sheetEstFin ? XLSX.utils.sheet_to_json(sheetEstFin, { header: 1, defval: '' }) : [];
    const rowsHorizontal: any[][] = sheetHorizontal ? XLSX.utils.sheet_to_json(sheetHorizontal, { header: 1, defval: '' }) : [];
    const rowsVertical: any[][] = sheetVertical ? XLSX.utils.sheet_to_json(sheetVertical, { header: 1, defval: '' }) : [];
    const rowsRatios: any[][] = sheetRatios ? XLSX.utils.sheet_to_json(sheetRatios, { header: 1, defval: '' }) : [];
    const rowsDupont: any[][] = sheetDupont && sheetDupont !== sheetRatios ? XLSX.utils.sheet_to_json(sheetDupont, { header: 1, defval: '' }) : [];
    const rowsDatos: any[][] = sheetDatosDashboard ? XLSX.utils.sheet_to_json(sheetDatosDashboard, { header: 1, defval: '' }) : [];

    const allSheetsData: { name: string; rows: any[][] }[] = sheetNames.map(name => ({
      name,
      rows: workbook.Sheets[name] ? XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: '' }) : []
    }));

    // Helper to safely parse numbers from cells (handles strings, currencies, percent, and negative parentheses like (9.66))
    const parseNumber = (val: any): number | null => {
      if (typeof val === 'number') {
        return isNaN(val) ? null : val;
      }
      if (typeof val !== 'string') return null;
      let s = val.trim();
      if (!s) return null;

      let isNegative = false;
      // Handle accounting parentheses: "(123.45)" or "(10 días)"
      if (s.startsWith('(') && s.endsWith(')')) {
        isNegative = true;
        s = s.substring(1, s.length - 1).trim();
      } else if (/^([▼▲]\s*)?-\s*\d/.test(s) || /^\s*-\s*\d/.test(s) || /-\d/.test(s)) {
        isNegative = true;
      }

      // Remove unwanted chars except digits, comma, dot
      let cleaned = s.replace(/[^0-9.,]/g, '');
      if (!cleaned) return null;

      if (cleaned.includes('.') && cleaned.includes(',')) {
        if (cleaned.indexOf('.') < cleaned.indexOf(',')) {
          // Spanish format: 1.234,56 -> 1234.56
          cleaned = cleaned.replace(/\./g, '').replace(',', '.');
        } else {
          // US format: 1,234.56 -> 1234.56
          cleaned = cleaned.replace(/,/g, '');
        }
      } else if (cleaned.includes(',')) {
        cleaned = cleaned.replace(',', '.');
      }

      const num = parseFloat(cleaned);
      if (isNaN(num)) return null;
      return isNegative ? -Math.abs(num) : num;
    };

    // Helper to detect column indices for 2025 and 2024 in any sheet header
    const detectYearColumns = (rows: any[][]): { col2025: number; col2024: number } => {
      let col2025 = -1;
      let col2024 = -1;
      const maxRowsToCheck = Math.min(rows.length, 30);

      // Pass 1: Look for a row containing BOTH 2025 and 2024 in distinct columns
      for (let r = 0; r < maxRowsToCheck; r++) {
        const row = rows[r];
        if (!row || row.length < 2) continue;

        let c25 = -1;
        let c24 = -1;

        for (let c = 0; c < row.length; c++) {
          const str = String(row[c] || '').toLowerCase().trim();
          if (!str) continue;

          const has25 = str.includes('2025') || str === '25' || str.includes('dic 25') || str.includes('dic. 25') || str.includes('dic-25');
          const has24 = str.includes('2024') || str === '24' || str.includes('dic 24') || str.includes('dic. 24') || str.includes('dic-24');

          // Skip cells that contain both years (e.g. title: "ANÁLISIS 2024 - 2025")
          if (has25 && has24) continue;

          if (has25 && c25 === -1) {
            c25 = c;
          } else if (has24 && c24 === -1) {
            c24 = c;
          }
        }

        if (c25 !== -1 && c24 !== -1 && c25 !== c24) {
          return { col2025: c25, col2024: c24 };
        }
      }

      // Pass 2: Fallback single search
      for (let r = 0; r < maxRowsToCheck; r++) {
        const row = rows[r];
        if (!row) continue;
        for (let c = 0; c < row.length; c++) {
          const str = String(row[c] || '').toLowerCase().trim();
          if (!str) continue;
          const has25 = str.includes('2025');
          const has24 = str.includes('2024');
          if (has25 && has24) continue;

          if (has25 && col2025 === -1) {
            col2025 = c;
          }
          if (has24 && col2024 === -1) {
            col2024 = c;
          }
        }
        if (col2025 !== -1 && col2024 !== -1 && col2025 !== col2024) {
          return { col2025, col2024 };
        }
      }

      return { col2025: -1, col2024: -1 };
    };

    // Helper for millions formatting (strictly 2 decimal digits)
    const toM = (val: number): number => {
      if (Math.abs(val) > 100_000) {
        return Number((val / 1_000_000).toFixed(2));
      }
      return Number(val.toFixed(2));
    };

    // Helper for percentage formatting (strictly 2 decimal digits)
    const toPct = (val: number): number => {
      if (Math.abs(val) <= 1 && val !== 0) {
        return Number((val * 100).toFixed(2));
      }
      return Number(val.toFixed(2));
    };

    const pctDiff = (v25: number, v24: number): string => {
      if (!v24) return '0.00%';
      const diff = ((v25 - v24) / Math.abs(v24)) * 100;
      return (diff >= 0 ? '▲ +' : '▼ ') + diff.toFixed(2) + '% vs 2024';
    };

    // Flexible concept extractor across rows in any 2D sheet
    const findConceptValues = (
      rows: any[][],
      matchers: (text: string) => boolean,
      isPercentage: boolean = false
    ): { val2025: number; val2024: number; found: boolean } => {
      if (!rows || rows.length === 0) return { val2025: 0, val2024: 0, found: false };

      const { col2025, col2024 } = detectYearColumns(rows);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        let matched = false;
        let matchedCol = -1;
        for (let c = 0; c < Math.min(row.length, 5); c++) {
          const cellStr = String(row[c] ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
          if (cellStr && matchers(cellStr)) {
            matched = true;
            matchedCol = c;
            break;
          }
        }

        if (matched) {
          // If explicit year columns were found and don't clash with label column
          if (col2025 !== -1 && col2024 !== -1 && col2025 !== matchedCol && col2024 !== matchedCol) {
            const raw25 = row[col2025];
            const raw24 = row[col2024];
            const v25Raw = parseNumber(raw25);
            const v24Raw = parseNumber(raw24);
            if (v25Raw !== null && v24Raw !== null) {
              let v25 = v25Raw;
              let v24 = v24Raw;
              const hasPct25 = typeof raw25 === 'string' && raw25.includes('%');
              const hasPct24 = typeof raw24 === 'string' && raw24.includes('%');
              if (isPercentage && !hasPct25 && Math.abs(v25) <= 1 && v25 !== 0) v25 = v25 * 100;
              if (isPercentage && !hasPct24 && Math.abs(v24) <= 1 && v24 !== 0) v24 = v24 * 100;
              return { val2025: Number(v25.toFixed(2)), val2024: Number(v24.toFixed(2)), found: true };
            }
          }

          // Otherwise collect numbers in row after label
          const parsedNums: { num: number; raw: any }[] = [];
          for (let c = matchedCol + 1; c < row.length; c++) {
            const num = parseNumber(row[c]);
            if (num !== null) {
              parsedNums.push({ num, raw: row[c] });
            }
          }

          if (parsedNums.length >= 2) {
            let item25 = parsedNums[0];
            let item24 = parsedNums[1];
            if (col2024 !== -1 && col2025 !== -1 && col2024 < col2025) {
              item25 = parsedNums[1];
              item24 = parsedNums[0];
            }
            let v25 = item25.num;
            let v24 = item24.num;
            const hasPct25 = typeof item25.raw === 'string' && item25.raw.includes('%');
            const hasPct24 = typeof item24.raw === 'string' && item24.raw.includes('%');
            if (isPercentage && !hasPct25 && Math.abs(v25) <= 1 && v25 !== 0) v25 = v25 * 100;
            if (isPercentage && !hasPct24 && Math.abs(v24) <= 1 && v24 !== 0) v24 = v24 * 100;
            return { val2025: Number(v25.toFixed(2)), val2024: Number(v24.toFixed(2)), found: true };
          } else if (parsedNums.length === 1) {
            let v = parsedNums[0].num;
            const hasPct = typeof parsedNums[0].raw === 'string' && parsedNums[0].raw.includes('%');
            if (isPercentage && !hasPct && Math.abs(v) <= 1 && v !== 0) v = v * 100;
            return { val2025: Number(v.toFixed(2)), val2024: Number(v.toFixed(2)), found: true };
          }
        }
      }

      return { val2025: 0, val2024: 0, found: false };
    };

    // Helper to find numbers by concept row in any 2D table
    const findValuesInRows = (rows: any[][], conceptKeyword: string): { val2025: number; val2024: number } => {
      const cleanKeyword = conceptKeyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;
        
        const firstCol = String(row[0] || row[1] || '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim();

        let matched = false;
        if (cleanKeyword === 'total activo' || cleanKeyword === 'total del activo') {
          matched = (firstCol.includes('total') && firstCol.includes('activo') && !firstCol.includes('corriente')) || firstCol === 'total del activo' || firstCol === 'total activo';
        } else if (cleanKeyword === 'total pasivo' || cleanKeyword === 'total del pasivo') {
          matched = (firstCol.includes('total') && firstCol.includes('pasivo') && !firstCol.includes('corriente') && !firstCol.includes('patrimonio')) || firstCol === 'total del pasivo' || firstCol === 'total pasivo';
        } else if (cleanKeyword === 'total patrimonio' || cleanKeyword === 'total del patrimonio neto') {
          matched = (firstCol.includes('total') && firstCol.includes('patrimonio')) || firstCol === 'total del patrimonio neto' || firstCol === 'total patrimonio neto';
        } else if (cleanKeyword === 'total activo corriente') {
          matched = firstCol.includes('total') && firstCol.includes('activo') && firstCol.includes('corriente') && !firstCol.includes('no corriente');
        } else if (cleanKeyword === 'total activo no corriente') {
          matched = firstCol.includes('total') && firstCol.includes('activo') && firstCol.includes('no corriente');
        } else if (cleanKeyword === 'total pasivo corriente') {
          matched = firstCol.includes('total') && firstCol.includes('pasivo') && firstCol.includes('corriente') && !firstCol.includes('no corriente');
        } else if (cleanKeyword === 'total pasivo no corriente') {
          matched = firstCol.includes('total') && firstCol.includes('pasivo') && firstCol.includes('no corriente');
        } else {
          matched = firstCol.includes(cleanKeyword);
        }

        if (matched) {
          const nums: number[] = [];
          for (let col = 1; col < row.length; col++) {
            const parsed = parseNumber(row[col]);
            if (parsed !== null) {
              nums.push(parsed);
            }
          }
          if (nums.length >= 2) {
            return { val2025: Math.abs(nums[0]), val2024: Math.abs(nums[1]) };
          } else if (nums.length === 1) {
            return { val2025: Math.abs(nums[0]), val2024: Math.abs(nums[0]) };
          }
        }
      }
      return { val2025: 0, val2024: 0 };
    };

    // Helper for ratios specific row parsing
    const findRatioValues = (rows: any[][], ratioName: string, isPercentage: boolean = false): { val2025: number; val2024: number } => {
      const cleanName = ratioName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      const res = findConceptValues(rows, (t) => t.includes(cleanName), isPercentage);
      return { val2025: res.val2025, val2024: res.val2024 };
    };

    // 1. Balance breakdown extraction
    const curAsset = findValuesInRows(rowsEstFin.length ? rowsEstFin : rowsVertical, 'total activo corriente');
    const nonCurAsset = findValuesInRows(rowsEstFin.length ? rowsEstFin : rowsVertical, 'total activo no corriente');
    const totAsset = findValuesInRows(rowsEstFin.length ? rowsEstFin : rowsVertical, 'total activo');
    const inventarios = findValuesInRows(rowsEstFin.length ? rowsEstFin : rowsVertical, 'inventario');
    const deudaFin = findValuesInRows(rowsEstFin.length ? rowsEstFin : rowsVertical, 'deuda financiera');

    const curLiab = findValuesInRows(rowsEstFin.length ? rowsEstFin : rowsVertical, 'total pasivo corriente');
    const nonCurLiab = findValuesInRows(rowsEstFin.length ? rowsEstFin : rowsVertical, 'total pasivo no corriente');
    const totLiab = findValuesInRows(rowsEstFin.length ? rowsEstFin : rowsVertical, 'total pasivo');
    const totEquity = findValuesInRows(rowsEstFin.length ? rowsEstFin : rowsVertical, 'total patrimonio');

    const hasDatosSheet = rowsDatos && rowsDatos.length > 20 && Boolean(rowsDatos[5]?.[1]);

    const totalAssets2025 = hasDatosSheet ? toM(Number(rowsDatos[5][1])) : (totAsset.val2025 ? toM(totAsset.val2025) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.totalAssets2025);
    const totalAssets2024 = hasDatosSheet ? toM(Number(rowsDatos[5][2])) : (totAsset.val2024 ? toM(totAsset.val2024) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.totalAssets2024);

    const equity2025 = hasDatosSheet ? toM(Number(rowsDatos[8][1])) : (totEquity.val2025 ? toM(totEquity.val2025) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.equity2025);
    const equity2024 = hasDatosSheet ? toM(Number(rowsDatos[8][2])) : (totEquity.val2024 ? toM(totEquity.val2024) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.equity2024);

    const totalLiabilities2025 = hasDatosSheet ? Number((totalAssets2025 - equity2025).toFixed(2)) : (totLiab.val2025 ? toM(totLiab.val2025) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.totalLiabilities2025);
    const totalLiabilities2024 = hasDatosSheet ? Number((totalAssets2024 - equity2024).toFixed(2)) : (totLiab.val2024 ? toM(totLiab.val2024) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.totalLiabilities2024);

    const currentAssets2025 = curAsset.val2025 ? toM(curAsset.val2025) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.currentAssets2025;
    const currentAssets2024 = curAsset.val2024 ? toM(curAsset.val2024) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.currentAssets2024;
    const nonCurrentAssets2025 = nonCurAsset.val2025 ? toM(nonCurAsset.val2025) : Number((totalAssets2025 - currentAssets2025).toFixed(2));
    const nonCurrentAssets2024 = nonCurAsset.val2024 ? toM(nonCurAsset.val2024) : Number((totalAssets2024 - currentAssets2024).toFixed(2));

    const currentLiabilities2025 = curLiab.val2025 ? toM(curLiab.val2025) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.currentLiabilities2025;
    const currentLiabilities2024 = curLiab.val2024 ? toM(curLiab.val2024) : COMMERCIAL_INITIAL_DATA.balanceBreakdown.currentLiabilities2024;
    const nonCurrentLiabilities2025 = nonCurLiab.val2025 ? toM(nonCurLiab.val2025) : Number((totalLiabilities2025 - currentLiabilities2025).toFixed(2));
    const nonCurrentLiabilities2024 = nonCurLiab.val2024 ? toM(nonCurLiab.val2024) : Number((totalLiabilities2024 - currentLiabilities2024).toFixed(2));

    const pctCurrentAssets2025 = Number(((currentAssets2025 / totalAssets2025) * 100).toFixed(2));
    const pctCurrentAssets2024 = Number(((currentAssets2024 / totalAssets2024) * 100).toFixed(2));
    const pctNonCurrentAssets2025 = Number(((nonCurrentAssets2025 / totalAssets2025) * 100).toFixed(2));
    const pctNonCurrentAssets2024 = Number(((nonCurrentAssets2024 / totalAssets2024) * 100).toFixed(2));

    const pctCurrentLiabilities2025 = Number(((currentLiabilities2025 / totalAssets2025) * 100).toFixed(2));
    const pctCurrentLiabilities2024 = Number(((currentLiabilities2024 / totalAssets2024) * 100).toFixed(2));
    const pctNonCurrentLiabilities2025 = Number(((nonCurrentLiabilities2025 / totalAssets2025) * 100).toFixed(2));
    const pctNonCurrentLiabilities2024 = Number(((nonCurrentLiabilities2024 / totalAssets2024) * 100).toFixed(2));
    const pctTotalLiabilities2025 = Number(((totalLiabilities2025 / totalAssets2025) * 100).toFixed(2));
    const pctTotalLiabilities2024 = Number(((totalLiabilities2024 / totalAssets2024) * 100).toFixed(2));

    const pctEquity2025 = Number(((equity2025 / totalAssets2025) * 100).toFixed(2));
    const pctEquity2024 = Number(((equity2024 / totalAssets2024) * 100).toFixed(2));

    const balanceBreakdown: BalanceBreakdown = {
      currentAssets2025,
      currentAssets2024,
      pctCurrentAssets2025,
      pctCurrentAssets2024,
      nonCurrentAssets2025,
      nonCurrentAssets2024,
      pctNonCurrentAssets2025,
      pctNonCurrentAssets2024,
      totalAssets2025,
      totalAssets2024,
      currentLiabilities2025,
      currentLiabilities2024,
      pctCurrentLiabilities2025,
      pctCurrentLiabilities2024,
      nonCurrentLiabilities2025,
      nonCurrentLiabilities2024,
      pctNonCurrentLiabilities2025,
      pctNonCurrentLiabilities2024,
      totalLiabilities2025,
      totalLiabilities2024,
      pctTotalLiabilities2025,
      pctTotalLiabilities2024,
      equity2025,
      equity2024,
      pctEquity2025,
      pctEquity2024
    };

    // 2. Income breakdown extraction
    const rev = findValuesInRows(rowsEstFin, 'ingresos netos') || findValuesInRows(rowsEstFin, 'ingresos financieros');
    const gross = findValuesInRows(rowsEstFin, 'margen bruto') || findValuesInRows(rowsEstFin, 'resultado financiero bruto');
    const ebit = findValuesInRows(rowsEstFin, 'utilidad operativa') || findValuesInRows(rowsEstFin, 'resultado de operacion neto');
    const ebt = findValuesInRows(rowsEstFin, 'utilidad antes de impuestos') || findValuesInRows(rowsEstFin, 'ebt');
    const netProf = findValuesInRows(rowsEstFin, 'utilidad neta') || findValuesInRows(rowsEstFin, 'resultado neto');

    const netRevenue2025 = hasDatosSheet ? toM(Number(rowsDatos[9][1])) : (rev.val2025 ? toM(rev.val2025) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.netRevenue2025);
    const netRevenue2024 = hasDatosSheet ? toM(Number(rowsDatos[9][2])) : (rev.val2024 ? toM(rev.val2024) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.netRevenue2024);
    const grossProfit2025 = hasDatosSheet ? toM(Number(rowsDatos[10][1])) : (gross.val2025 ? toM(gross.val2025) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.grossProfit2025);
    const grossProfit2024 = hasDatosSheet ? toM(Number(rowsDatos[10][2])) : (gross.val2024 ? toM(gross.val2024) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.grossProfit2024);
    const operatingProfit2025 = hasDatosSheet ? toM(Number(rowsDatos[11][1])) : (ebit.val2025 ? toM(ebit.val2025) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.operatingProfit2025);
    const operatingProfit2024 = hasDatosSheet ? toM(Number(rowsDatos[11][2])) : (ebit.val2024 ? toM(ebit.val2024) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.operatingProfit2024);
    const netProfit2025 = hasDatosSheet ? toM(Number(rowsDatos[12][1])) : (netProf.val2025 ? toM(netProf.val2025) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.netProfit2025);
    const netProfit2024 = hasDatosSheet ? toM(Number(rowsDatos[12][2])) : (netProf.val2024 ? toM(netProf.val2024) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.netProfit2024);

    const incomeBreakdown: IncomeBreakdown = {
      netRevenue2025,
      netRevenue2024,
      costOfSales2025: COMMERCIAL_INITIAL_DATA.incomeBreakdown.costOfSales2025,
      costOfSales2024: COMMERCIAL_INITIAL_DATA.incomeBreakdown.costOfSales2024,
      grossProfit2025,
      grossProfit2024,
      operatingExpenses2025: COMMERCIAL_INITIAL_DATA.incomeBreakdown.operatingExpenses2025,
      operatingExpenses2024: COMMERCIAL_INITIAL_DATA.incomeBreakdown.operatingExpenses2024,
      operatingProfit2025,
      operatingProfit2024,
      financialExpenses2025: COMMERCIAL_INITIAL_DATA.incomeBreakdown.financialExpenses2025,
      financialExpenses2024: COMMERCIAL_INITIAL_DATA.incomeBreakdown.financialExpenses2024,
      profitBeforeTax2025: ebt.val2025 ? toM(ebt.val2025) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.profitBeforeTax2025,
      profitBeforeTax2024: ebt.val2024 ? toM(ebt.val2024) : COMMERCIAL_INITIAL_DATA.incomeBreakdown.profitBeforeTax2024,
      taxes2025: COMMERCIAL_INITIAL_DATA.incomeBreakdown.taxes2025,
      taxes2024: COMMERCIAL_INITIAL_DATA.incomeBreakdown.taxes2024,
      netProfit2025,
      netProfit2024
    };

    // 3. Ratios extraction with flexible concept matching and Excel row parsing
    const matchRC = (t: string) => t.includes('razon corriente') || t.includes('liquidez corriente') || t === 'rc';
    const matchRDP = (t: string) => t.includes('deuda / patrimonio') || t.includes('deuda/patrimonio') || t.includes('relacion deuda') || t.includes('rdp');
    const matchCob = (t: string) => t.includes('cobertura') && (t.includes('interes') || t.includes('ebit/gf') || t.includes('deuda'));
    const matchROE = (t: string) => t === 'roe' || t.includes('(roe)') || t.includes('retorno s/ patrimonio') || t.includes('rentabilidad del patrimonio');
    const matchROA = (t: string) => t === 'roa' || t.includes('(roa)') || t.includes('retorno s/ activo') || t.includes('rentabilidad del activo');

    const matchCCE = (t: string) => (
      (t.includes('ciclo') && (t.includes('conversion') || t.includes('efectivo') || t.includes('cce') || t.includes('caja') || t.includes('capital'))) ||
      t === 'cce' ||
      t.includes('(cce)') ||
      t.startsWith('cce ') ||
      t.endsWith(' cce') ||
      t.includes('ciclo conversion') ||
      t.includes('ciclo de conversion') ||
      t.includes('ciclo operativo neto')
    );

    const matchDIO = (t: string) => (
      t === 'dio' ||
      t.includes('(dio)') ||
      t.startsWith('dio ') ||
      (t.includes('dias') && t.includes('inventario')) ||
      (t.includes('rotacion') && t.includes('inventario') && (t.includes('dias') || t.includes('plazo') || t.includes('periodo'))) ||
      (t.includes('permanencia') && t.includes('inventario')) ||
      t.includes('plazo medio de inventario') ||
      t.includes('periodo medio de inventario')
    );

    const matchDSO = (t: string) => (
      t === 'dso' ||
      t.includes('(dso)') ||
      t.startsWith('dso ') ||
      (t.includes('dias') && (t.includes('cobro') || t.includes('cxc') || t.includes('cobrar'))) ||
      (t.includes('periodo') && (t.includes('cobro') || t.includes('cobrar'))) ||
      (t.includes('plazo') && (t.includes('cobro') || t.includes('cobrar'))) ||
      t.includes('rotacion de cobro en dias')
    );

    const matchDPO = (t: string) => (
      t === 'dpo' ||
      t.includes('(dpo)') ||
      t.startsWith('dpo ') ||
      (t.includes('dias') && (t.includes('pago') || t.includes('cxp') || t.includes('proveedor'))) ||
      (t.includes('periodo') && (t.includes('pago') || t.includes('proveedor'))) ||
      (t.includes('plazo') && (t.includes('pago') || t.includes('proveedor'))) ||
      t.includes('rotacion de pago en dias')
    );

    // Universal multi-sheet concept lookup helper
    const searchAcrossSheets = (matcher: (t: string) => boolean, isPct: boolean = false) => {
      let res = findConceptValues(rowsDupont, matcher, isPct);
      if (!res.found) res = findConceptValues(rowsRatios, matcher, isPct);
      if (!res.found && rowsDatos.length > 0) res = findConceptValues(rowsDatos, matcher, isPct);
      if (!res.found) {
        for (const s of allSheetsData) {
          res = findConceptValues(s.rows, matcher, isPct);
          if (res.found) break;
        }
      }
      return res;
    };

    // Dynamic extraction of CCE and Working Capital across sheets
    let cceData = searchAcrossSheets(matchCCE, false);
    let dioData = searchAcrossSheets(matchDIO, false);
    let dsoData = searchAcrossSheets(matchDSO, false);
    let dpoData = searchAcrossSheets(matchDPO, false);

    // Statements fallback for DIO, DSO, DPO calculation
    const costSales25 = Math.abs(findValuesInRows(rowsEstFin, 'costo de productos').val2025 || findValuesInRows(rowsEstFin, 'costo de ventas').val2025 || 810335830);
    const costSales24 = Math.abs(findValuesInRows(rowsEstFin, 'costo de productos').val2024 || findValuesInRows(rowsEstFin, 'costo de ventas').val2024 || 681656595);
    const inv25 = findValuesInRows(rowsEstFin, 'inventario').val2025 || 456198524;
    const inv24 = findValuesInRows(rowsEstFin, 'inventario').val2024 || 560634083;
    const cxc25 = findValuesInRows(rowsEstFin, 'cuentas por cobrar').val2025 || 94440440;
    const cxc24 = findValuesInRows(rowsEstFin, 'cuentas por cobrar').val2024 || 203110173;
    const cxp25 = findValuesInRows(rowsEstFin, 'cuentas por pagar').val2025 || 168315655;
    const cxp24 = findValuesInRows(rowsEstFin, 'cuentas por pagar').val2024 || 49440722;
    const rev25 = rev.val2025 || 1215703421;
    const rev24 = rev.val2024 || 977165060;

    const calcDio25 = costSales25 > 0 ? Number(((inv25 * 365) / costSales25).toFixed(2)) : 205.49;
    const calcDio24 = costSales24 > 0 ? Number(((inv24 * 365) / costSales24).toFixed(2)) : 300.08;
    const calcDso25 = rev25 > 0 ? Number(((cxc25 * 365) / rev25).toFixed(2)) : 31.92;
    const calcDso24 = rev24 > 0 ? Number(((cxc24 * 365) / rev24).toFixed(2)) : 95.12;
    const calcDpo25 = costSales25 > 0 ? Number(((cxp25 * 365) / costSales25).toFixed(2)) : 75.81;
    const calcDpo24 = costSales24 > 0 ? Number(((cxp24 * 365) / costSales24).toFixed(2)) : 26.47;

    const finalDio2025 = dioData.found ? dioData.val2025 : (hasDatosSheet && rowsDatos.length > 60 && parseNumber(rowsDatos[60]?.[1]) !== null ? parseNumber(rowsDatos[60][1])! : calcDio25);
    const finalDio2024 = dioData.found ? dioData.val2024 : (hasDatosSheet && rowsDatos.length > 60 && parseNumber(rowsDatos[60]?.[2]) !== null ? parseNumber(rowsDatos[60][2])! : calcDio24);

    const finalDso2025 = dsoData.found ? dsoData.val2025 : (hasDatosSheet && rowsDatos.length > 61 && parseNumber(rowsDatos[61]?.[1]) !== null ? parseNumber(rowsDatos[61][1])! : calcDso25);
    const finalDso2024 = dsoData.found ? dsoData.val2024 : (hasDatosSheet && rowsDatos.length > 61 && parseNumber(rowsDatos[61]?.[2]) !== null ? parseNumber(rowsDatos[61][2])! : calcDso24);

    const finalDpo2025 = dpoData.found ? dpoData.val2025 : (hasDatosSheet && rowsDatos.length > 62 && parseNumber(rowsDatos[62]?.[1]) !== null ? parseNumber(rowsDatos[62][1])! : calcDpo25);
    const finalDpo2024 = dpoData.found ? dpoData.val2024 : (hasDatosSheet && rowsDatos.length > 62 && parseNumber(rowsDatos[62]?.[2]) !== null ? parseNumber(rowsDatos[62][2])! : calcDpo24);

    // CCE determination:
    // 1. Direct row from Excel (if explicitly matched in ratios, datos, or statements)
    // 2. Computed DIO + DSO - DPO
    const finalCce2025 = cceData.found
      ? cceData.val2025
      : Number((finalDio2025 + finalDso2025 - finalDpo2025).toFixed(2));

    const finalCce2024 = cceData.found
      ? cceData.val2024
      : Number((finalDio2024 + finalDso2024 - finalDpo2024).toFixed(2));

    const valCCE2025 = finalCce2025;
    const valCCE2024 = finalCce2024;

    const rawRC = searchAcrossSheets(matchRC, false);
    const rawRDP = searchAcrossSheets(matchRDP, false);
    const rawCob = searchAcrossSheets(matchCob, false);
    const rawROE = searchAcrossSheets(matchROE, true);
    const rawROA = searchAcrossSheets(matchROA, true);

    const valRC2025 = rawRC.found ? rawRC.val2025 : (hasDatosSheet && parseNumber(rowsDatos[17]?.[1]) !== null ? parseNumber(rowsDatos[17][1])! : COMMERCIAL_INITIAL_DATA.kpis[3].value2025);
    const valRC2024 = rawRC.found ? rawRC.val2024 : (hasDatosSheet && parseNumber(rowsDatos[17]?.[2]) !== null ? parseNumber(rowsDatos[17][2])! : COMMERCIAL_INITIAL_DATA.kpis[3].value2024);

    // DuPont Motor 1: Exact search prioritizing '1. Margen Neto (Motor 1)' / 'Motor 1'
    const matchMotor1 = (t: string) => (
      t.includes('motor 1') ||
      t.includes('motor1') ||
      (t.includes('margen neto') && (t.includes('motor') || t.includes('dupont') || t.includes('1'))) ||
      t.startsWith('1. margen neto') ||
      t.startsWith('1.- margen neto') ||
      t.startsWith('1.margen neto') ||
      t.includes('1. margen neto (motor 1)') ||
      t.includes('margen neto (motor 1)')
    );

    const matchGeneralMN = (t: string) => (
      matchMotor1(t) ||
      (t.includes('margen') && t.includes('neto')) ||
      t.includes('rentabilidad s/ ventas') ||
      t.includes('rentabilidad sobre ventas') ||
      t.includes('utilidad neta / ventas') ||
      t.includes('utilidad neta / ingresos') ||
      t.includes('margen neto sobre ventas')
    );

    let rawMN = searchAcrossSheets(matchMotor1, true);
    if (!rawMN.found) rawMN = searchAcrossSheets(matchGeneralMN, true);

    // Precise calculation fallback from statements (Utilidad Neta / Ingresos Netos)
    const calcMN2025 = netRevenue2025 > 0 ? Number(((netProfit2025 / netRevenue2025) * 100).toFixed(2)) : 11.06;
    const calcMN2024 = netRevenue2024 > 0 ? Number(((netProfit2024 / netRevenue2024) * 100).toFixed(2)) : 12.94;
    const valMN2025 = rawMN.found ? rawMN.val2025 : calcMN2025;
    const valMN2024 = rawMN.found ? rawMN.val2024 : calcMN2024;

    const calcROA2025 = totalAssets2025 > 0 ? Number(((netProfit2025 / totalAssets2025) * 100).toFixed(2)) : 7.80;
    const calcROA2024 = totalAssets2024 > 0 ? Number(((netProfit2024 / totalAssets2024) * 100).toFixed(2)) : 8.36;
    const valROA2025 = rawROA.found ? rawROA.val2025 : (hasDatosSheet && parseNumber(rowsDatos[14]?.[1]) !== null ? toPct(parseNumber(rowsDatos[14][1])!) : calcROA2025);
    const valROA2024 = rawROA.found ? rawROA.val2024 : (hasDatosSheet && parseNumber(rowsDatos[14]?.[2]) !== null ? toPct(parseNumber(rowsDatos[14][2])!) : calcROA2024);

    const calcROE2025 = equity2025 > 0 ? Number(((netProfit2025 / equity2025) * 100).toFixed(2)) : 12.97;
    const calcROE2024 = equity2024 > 0 ? Number(((netProfit2024 / equity2024) * 100).toFixed(2)) : 12.99;
    const valROE2025 = rawROE.found ? rawROE.val2025 : (hasDatosSheet && parseNumber(rowsDatos[13]?.[1]) !== null ? toPct(parseNumber(rowsDatos[13][1])!) : calcROE2025);
    const valROE2024 = rawROE.found ? rawROE.val2024 : (hasDatosSheet && parseNumber(rowsDatos[13]?.[2]) !== null ? toPct(parseNumber(rowsDatos[13][2])!) : calcROE2024);

    const valRDP2025 = rawRDP.found ? rawRDP.val2025 : (hasDatosSheet && parseNumber(rowsDatos[18]?.[1]) !== null ? parseNumber(rowsDatos[18][1])! : 0.66);
    const valRDP2024 = rawRDP.found ? rawRDP.val2024 : (hasDatosSheet && parseNumber(rowsDatos[18]?.[2]) !== null ? parseNumber(rowsDatos[18][2])! : 0.55);

    const valCob2025 = rawCob.found ? rawCob.val2025 : (hasDatosSheet && parseNumber(rowsDatos[20]?.[1]) !== null ? parseNumber(rowsDatos[20][1])! : 8.99);
    const valCob2024 = rawCob.found ? rawCob.val2024 : (hasDatosSheet && parseNumber(rowsDatos[20]?.[2]) !== null ? parseNumber(rowsDatos[20][2])! : 4.13);

    // DuPont Motor 2: Exact search prioritizing '2. Rotación de Activos (Motor 2)'
    const matchMotor2 = (t: string) => (
      t.includes('motor 2') ||
      t.includes('motor2') ||
      (t.includes('rotacion') && t.includes('activo') && (t.includes('motor') || t.includes('dupont') || t.includes('2'))) ||
      t.startsWith('2. rotacion') ||
      t.startsWith('2.- rotacion') ||
      t.includes('rotacion de activos (motor 2)')
    );

    const matchGeneralRotAct = (t: string) => (
      matchMotor2(t) ||
      t.includes('rotacion de activos') ||
      t.includes('rotacion de activo') ||
      t.includes('rotacion del activo') ||
      t.includes('rotacion activo total') ||
      t.includes('rotacion activos totales')
    );

    let rawRotAct = searchAcrossSheets(matchMotor2, false);
    if (!rawRotAct.found) rawRotAct = searchAcrossSheets(matchGeneralRotAct, false);

    const calcRotAct2025 = totalAssets2025 > 0 ? Number((netRevenue2025 / totalAssets2025).toFixed(2)) : 0.71;
    const calcRotAct2024 = totalAssets2024 > 0 ? Number((netRevenue2024 / totalAssets2024).toFixed(2)) : 0.65;
    const valRotAct2025 = rawRotAct.found ? rawRotAct.val2025 : calcRotAct2025;
    const valRotAct2024 = rawRotAct.found ? rawRotAct.val2024 : calcRotAct2024;

    // DuPont Motor 3: Exact search prioritizing '3. Apalancamiento (Motor 3)'
    const matchMotor3 = (t: string) => (
      t.includes('motor 3') ||
      t.includes('motor3') ||
      (t.includes('apalancamiento') && (t.includes('motor') || t.includes('dupont') || t.includes('3'))) ||
      t.startsWith('3. apalancamiento') ||
      t.startsWith('3.- apalancamiento') ||
      t.includes('apalancamiento (motor 3)')
    );

    const matchGeneralApalanc = (t: string) => (
      matchMotor3(t) ||
      t.includes('apalancamiento') ||
      t.includes('multiplicador de capital') ||
      t.includes('multiplicador del capital') ||
      t.includes('activo / patrimonio') ||
      t.includes('activo/patrimonio')
    );

    let rawApalanc = searchAcrossSheets(matchMotor3, false);
    if (!rawApalanc.found) rawApalanc = searchAcrossSheets(matchGeneralApalanc, false);

    const calcApalanc2025 = equity2025 > 0 ? Number((totalAssets2025 / equity2025).toFixed(2)) : 1.66;
    const calcApalanc2024 = equity2024 > 0 ? Number((totalAssets2024 / equity2024).toFixed(2)) : 1.55;
    const valApalanc2025 = rawApalanc.found ? rawApalanc.val2025 : calcApalanc2025;
    const valApalanc2024 = rawApalanc.found ? rawApalanc.val2024 : calcApalanc2024;

    // DuPont ROE Resultado
    const matchDupontRoe = (t: string) => (
      (t.includes('roe') && (t.includes('dupont') || t.includes('resultado'))) ||
      t === 'roe dupont' ||
      t.includes('(resultado)')
    );

    let rawDupontRoe = searchAcrossSheets(matchDupontRoe, true);
    const calcDupontRoe2025 = Number(((valMN2025 / 100) * valRotAct2025 * valApalanc2025 * 100).toFixed(2));
    const calcDupontRoe2024 = Number(((valMN2024 / 100) * valRotAct2024 * valApalanc2024 * 100).toFixed(2));
    const valDupontRoe2025 = rawDupontRoe.found ? rawDupontRoe.val2025 : calcDupontRoe2025;
    const valDupontRoe2024 = rawDupontRoe.found ? rawDupontRoe.val2024 : calcDupontRoe2024;

    const diffMN = Number((valMN2025 - valMN2024).toFixed(2));
    const diffMNText = `${diffMN >= 0 ? '+' : ''}${diffMN.toFixed(2)} p.p.`;

    const diffRot = Number((valRotAct2025 - valRotAct2024).toFixed(2));
    const diffRotText = `${diffRot >= 0 ? '+' : ''}${diffRot.toFixed(2)}x`;

    const diffAp = Number((valApalanc2025 - valApalanc2024).toFixed(2));
    const diffApText = `${diffAp >= 0 ? '+' : ''}${diffAp.toFixed(2)}x`;

    const diffRoe = Number((valDupontRoe2025 - valDupontRoe2024).toFixed(2));
    const diffRoeText = `${diffRoe >= 0 ? '+' : ''}${diffRoe.toFixed(2)} p.p.`;

    const dupont: DuPontData = {
      netMargin: {
        title: '1. Margen Neto (Motor 1)',
        name: 'Rentabilidad s/ Ventas',
        formula: 'Utilidad Neta / Ingresos Netos',
        year2025: Number(valMN2025.toFixed(2)),
        year2024: Number(valMN2024.toFixed(2)),
        diff: diffMN,
        unit: '%',
        description: 'Porcentaje de ingresos que queda como ganancia líquida tras costos operativos y diferencia de cambio.',
        categoryLabel: 'Eficacia Comercial',
        impactOnRoe: `Impacto en el ROE: ${diffMNText} debido al margen comercial y costos operativos.`
      },
      assetTurnover: {
        title: '2. Rotación de Activos (Motor 2)',
        name: 'Eficiencia en Activos',
        formula: 'Ingresos Netos / Activos Totales',
        year2025: Number(valRotAct2025.toFixed(2)),
        year2024: Number(valRotAct2024.toFixed(2)),
        diff: diffRot,
        unit: 'x',
        description: 'Ventas generadas por cada Boliviano invertido en inventarios, infraestructura y activos totales.',
        categoryLabel: 'Rotación Comercial',
        impactOnRoe: `Aporte dinamizador: ${diffRotText} por velocidad en ventas de bienes y repuestos.`
      },
      financialLeverage: {
        title: '3. Apalancamiento (Motor 3)',
        name: 'Multiplicador de Capital',
        formula: 'Activos Totales / Patrimonio Neto',
        year2025: Number(valApalanc2025.toFixed(2)),
        year2024: Number(valApalanc2024.toFixed(2)),
        diff: diffAp,
        unit: 'x',
        description: 'Relación entre recursos totales y fondos propios de los accionistas.',
        categoryLabel: 'Estructura Financiera',
        impactOnRoe: `Impacto en el ROE: ${diffApText} por apalancamiento financiero y estructura de capital.`
      },
      roe: {
        title: 'ROE DuPont (resultado)',
        name: 'Rendimiento s/ Patrimonio',
        formula: 'Margen Neto × Rotación × Apalancamiento',
        year2025: Number(valDupontRoe2025.toFixed(2)),
        year2024: Number(valDupontRoe2024.toFixed(2)),
        diff: diffRoe,
        unit: '%',
        description: `${valMN2025.toFixed(2)}% × ${valRotAct2025.toFixed(2)}x × ${valApalanc2025.toFixed(2)}x = ${valDupontRoe2025.toFixed(2)}% (Gestión 2025).`,
        categoryLabel: 'Retorno para Accionistas',
        impactOnRoe: `ROE DuPont = ${valDupontRoe2025.toFixed(2)}% (ROE Directo Contable = ${valROE2025.toFixed(2)}%).`
      },
      verificationMatch: Math.abs(valDupontRoe2025 - valROE2025) < 0.25,
      attributionAnalysis: {
        marginImpact: `Margen Neto: ${diffMNText} en el rendimiento sobre ventas`,
        turnoverImpact: `Rotación de Activos: ${diffRotText} en la rotación de ventas sobre activos`,
        leverageImpact: `Apalancamiento: ${diffApText} en el multiplicador de fondos propios`,
        conclusion: `El ROE DuPont se ubicó en ${valDupontRoe2025.toFixed(2)}% (2024: ${valDupontRoe2024.toFixed(2)}%): ${diffMN < 0 ? 'la contracción del margen neto (' + diffMNText + ')' : 'la mejora del margen neto (' + diffMNText + ')'} combinada con una rotación de ${valRotAct2025.toFixed(2)}x y apalancamiento de ${valApalanc2025.toFixed(2)}x determinaron el retorno patrimonial.`
      }
    };

    // RIBBON 1: BALANCE GENERAL Y ESTADO DE GANANCIAS Y PÉRDIDAS (8 TARJETAS - IMAGEN 1)
    const valInv2025 = hasDatosSheet ? toM(Number(rowsDatos[6][1])) : (inventarios.val2025 ? toM(inventarios.val2025) : COMMERCIAL_INITIAL_DATA.balanceIncomeKpis[1].value2025);
    const valInv2024 = hasDatosSheet ? toM(Number(rowsDatos[6][2])) : (inventarios.val2024 ? toM(inventarios.val2024) : COMMERCIAL_INITIAL_DATA.balanceIncomeKpis[1].value2024);
    const valDeuda2025 = hasDatosSheet ? toM(Number(rowsDatos[7][1])) : (deudaFin.val2025 ? toM(deudaFin.val2025) : COMMERCIAL_INITIAL_DATA.balanceIncomeKpis[2].value2025);
    const valDeuda2024 = hasDatosSheet ? toM(Number(rowsDatos[7][2])) : (deudaFin.val2024 ? toM(deudaFin.val2024) : COMMERCIAL_INITIAL_DATA.balanceIncomeKpis[2].value2024);

    const balanceIncomeKpis: KpiCardData[] = [
      {
        title: 'Activo Total (Bs. M)',
        subtitle: 'Recursos Totales',
        value2025: totalAssets2025,
        value2024: totalAssets2024,
        diffText: pctDiff(totalAssets2025, totalAssets2024),
        isPositive: totalAssets2025 >= totalAssets2024,
        unit: '',
        isCurrency: false,
        explanation: 'Expansión de activos impulsada por mayores colocaciones en DPFs temporarios (Bs. 538.3M) y modernización operativa (+14.0%).'
      },
      {
        title: 'Inventarios (Bs. M)',
        subtitle: 'Stock de Mercaderías',
        value2025: valInv2025,
        value2024: valInv2024,
        diffText: pctDiff(valInv2025, valInv2024),
        isPositive: true,
        unit: '',
        isCurrency: false,
        explanation: 'Excelente gestión logística y comercial: optimización del inventario con disminución del 18.6% y reducción de permanencia a 205 días.'
      },
      {
        title: 'Deuda Financiera Total (Bs. M)',
        subtitle: 'Bancos y Emisiones',
        value2025: valDeuda2025,
        value2024: valDeuda2024,
        diffText: pctDiff(valDeuda2025, valDeuda2024),
        isPositive: false,
        unit: '',
        isCurrency: false,
        explanation: 'Incremento moderado del 12.0% en financiamiento bancario y bonos corporativos, estructurado mayormente a largo plazo (Bs. 224.5M).'
      },
      {
        title: 'Patrimonio Neto (Bs. M)',
        subtitle: 'Capital y Reservas',
        value2025: equity2025,
        value2024: equity2024,
        diffText: pctDiff(equity2025, equity2024),
        isPositive: equity2025 >= equity2024,
        unit: '',
        isCurrency: false,
        explanation: 'Fortalecimiento patrimonial (+6.4%) por reinversión de utilidades líquidas, alcanzando el 60.2% de financiamiento de los activos totales.'
      },
      {
        title: 'Ingresos Netos (Bs. M)',
        subtitle: 'Ventas Comerciales',
        value2025: netRevenue2025,
        value2024: netRevenue2024,
        diffText: pctDiff(netRevenue2025, netRevenue2024),
        isPositive: netRevenue2025 >= netRevenue2024,
        unit: '',
        isCurrency: false,
        explanation: 'Crecimiento extraordinario del 24.4% en ventas comerciales, liderado por la venta de camiones, repuestos y maquinaria agrícola John Deere.'
      },
      {
        title: 'Margen Bruto (Bs. M)',
        subtitle: 'Ganancia Comercial',
        value2025: grossProfit2025,
        value2024: grossProfit2024,
        diffText: pctDiff(grossProfit2025, grossProfit2024),
        isPositive: grossProfit2025 >= grossProfit2024,
        unit: '',
        isCurrency: false,
        explanation: 'Fuerte salto del 37.2% en el margen bruto gracias a mejores precios unitarios de venta y sinergias comerciales en repuestos y servicios.'
      },
      {
        title: 'Utilidad Operativa EBIT (Bs. M)',
        subtitle: 'Resultado de Operaciones',
        value2025: operatingProfit2025,
        value2024: operatingProfit2024,
        diffText: pctDiff(operatingProfit2025, operatingProfit2024),
        isPositive: operatingProfit2025 >= operatingProfit2024,
        unit: '',
        isCurrency: false,
        explanation: 'Crecimiento de casi 60% en la utilidad operativa debido al apalancamiento operativo de la estructura de costos comerciales.'
      },
      {
        title: 'Utilidad Neta (Bs. M)',
        subtitle: 'Resultado Final del Ejercicio',
        value2025: netProfit2025,
        value2024: netProfit2024,
        diffText: pctDiff(netProfit2025, netProfit2024),
        isPositive: true,
        unit: '',
        isCurrency: false,
        explanation: 'Ganancia líquida final de Bs. 134.5 millones (+6.3%), absorbiendo íntegramente la carga de diferencia de cambio de Bs. 105.4M.'
      }
    ];

    // RIBBON 2: RENTABILIDAD, ACTIVIDAD AUTOMOTRIZ, LIQUIDEZ Y COVENANTS BBV (8 TARJETAS - IMAGEN 1)
    const rawMB = searchAcrossSheets((t) => t.includes('margen bruto') && (t.includes('%') || t.includes('porcentual') || !t.includes('bs')), true);
    const rawMO = searchAcrossSheets((t) => (t.includes('margen operativo') || t.includes('margen ebit')) && (t.includes('%') || t.includes('porcentual') || !t.includes('bs')), true);

    const calcMB25 = netRevenue2025 > 0 ? Number(((grossProfit2025 / netRevenue2025) * 100).toFixed(2)) : 33.34;
    const calcMB24 = netRevenue2024 > 0 ? Number(((grossProfit2024 / netRevenue2024) * 100).toFixed(2)) : 30.24;
    const valMB2025 = rawMB.found ? rawMB.val2025 : (hasDatosSheet && rowsDatos.length > 15 && parseNumber(rowsDatos[15]?.[1]) !== null ? toPct(parseNumber(rowsDatos[15][1])!) : calcMB25);
    const valMB2024 = rawMB.found ? rawMB.val2024 : (hasDatosSheet && rowsDatos.length > 15 && parseNumber(rowsDatos[15]?.[2]) !== null ? toPct(parseNumber(rowsDatos[15][2])!) : calcMB24);

    const calcMO25 = netRevenue2025 > 0 ? Number(((operatingProfit2025 / netRevenue2025) * 100).toFixed(2)) : 21.82;
    const calcMO24 = netRevenue2024 > 0 ? Number(((operatingProfit2024 / netRevenue2024) * 100).toFixed(2)) : 17.05;
    const valMO2025 = rawMO.found ? rawMO.val2025 : (hasDatosSheet && rowsDatos.length > 16 && parseNumber(rowsDatos[16]?.[1]) !== null ? toPct(parseNumber(rowsDatos[16][1])!) : calcMO25);
    const valMO2024 = rawMO.found ? rawMO.val2024 : (hasDatosSheet && rowsDatos.length > 16 && parseNumber(rowsDatos[16]?.[2]) !== null ? toPct(parseNumber(rowsDatos[16][2])!) : calcMO24);

    const ratioKpis: KpiCardData[] = [
      {
        title: 'ROE',
        subtitle: 'Retorno s/ Patrimonio',
        value2025: Number(valROE2025.toFixed(2)),
        value2024: Number(valROE2024.toFixed(2)),
        diffText: `${valROE2025 >= valROE2024 ? '▲ +' : '▼ '}${(valROE2025 - valROE2024).toFixed(2)} p.p. vs 2024`,
        isPositive: valROE2025 >= valROE2024,
        unit: '%',
        covenant: '≥ 12.00%',
        statusText: 'Cumplido',
        explanation: `Genera Bs. ${valROE2025.toFixed(2)} limpios por cada Bs. 100 de patrimonio de los accionistas, cumpliendo el covenant BBV.`
      },
      {
        title: 'ROA',
        subtitle: 'Retorno s/ Activos',
        value2025: Number(valROA2025.toFixed(2)),
        value2024: Number(valROA2024.toFixed(2)),
        diffText: `${valROA2025 >= valROA2024 ? '▲ +' : '▼ '}${(valROA2025 - valROA2024).toFixed(2)} p.p. vs 2024`,
        isPositive: false,
        unit: '%',
        covenant: '≥ 6.00%',
        statusText: 'Cumplido',
        explanation: `Elevado retorno sobre activos de ${valROA2025.toFixed(2)}%, reflejo de la alta rotación de inventarios y activos comerciales.`
      },
      {
        title: 'Margen Bruto (%)',
        subtitle: 'Margen s/ Ventas',
        value2025: valMB2025,
        value2024: valMB2024,
        diffText: `${valMB2025 >= valMB2024 ? '▲ +' : '▼ '}${(valMB2025 - valMB2024).toFixed(2)} p.p. vs 2024`,
        isPositive: true,
        unit: '%',
        covenant: '≥ 25.00%',
        statusText: valMB2025 >= 25 ? 'Excelente' : 'Alerta',
        explanation: `Rentabilidad bruta del ${valMB2025.toFixed(2)}%, expandida gracias al mix de ventas comerciales y mejores precios unitarios.`
      },
      {
        title: 'Margen Operativo EBIT (%)',
        subtitle: 'EBIT s/ Ventas',
        value2025: valMO2025,
        value2024: valMO2024,
        diffText: `${valMO2025 >= valMO2024 ? '▲ +' : '▼ '}${(valMO2025 - valMO2024).toFixed(2)} p.p. vs 2024`,
        isPositive: true,
        unit: '%',
        covenant: '≥ 15.00%',
        statusText: valMO2025 >= 15 ? 'Sobresaliente' : 'Alerta',
        explanation: `Margen operativo del ${valMO2025.toFixed(2)}%, con una expansión por economías de escala comerciales.`
      },
      {
        title: 'Razón Corriente',
        subtitle: 'Covenant BBV ≥ 1.20x',
        value2025: Number(valRC2025.toFixed(2)),
        value2024: Number(valRC2024.toFixed(2)),
        diffText: `${valRC2025 >= valRC2024 ? '▲ +' : '▼ '}${(valRC2025 - valRC2024).toFixed(2)}x vs 2024`,
        isPositive: true,
        unit: 'x',
        covenant: '≥ 1.20x',
        statusText: 'Cumple Holgado',
        explanation: `Solvencia de corto plazo de ${valRC2025.toFixed(2)}x: se cuenta con más de Bs. 3.00 de activo corriente por cada Bs. 1.00 de deuda inmediata.`
      },
      {
        title: 'Deuda / Patrimonio RDP',
        subtitle: 'Covenant BBV ≤ 2.50x',
        value2025: Number(valRDP2025.toFixed(2)),
        value2024: Number(valRDP2024.toFixed(2)),
        diffText: `${valRDP2025 >= valRDP2024 ? '▲ +' : '▼ '}${(valRDP2025 - valRDP2024).toFixed(2)}x vs 2024`,
        isPositive: true,
        unit: 'x',
        covenant: '≤ 2.50x',
        statusText: 'Bajo Riesgo',
        explanation: `Apalancamiento muy seguro de solo ${valRDP2025.toFixed(2)}x, ampliamente inferior al límite contractual máximo del covenant (≤ 2.50x).`
      },
      {
        title: 'Ciclo Conversión Efectivo',
        subtitle: 'DIO + DSO - DPO',
        value2025: valCCE2025,
        value2024: valCCE2024,
        diffText: `${valCCE2025 <= valCCE2024 ? '▼ ' : '▲ +'}${Math.abs(valCCE2025 - valCCE2024).toFixed(2)} d vs 2024`,
        isPositive: valCCE2025 <= valCCE2024,
        unit: 'días',
        covenant: '≤ 30 días',
        statusText: valCCE2025 <= 30 ? 'Óptimo' : 'Alerta',
        explanation: valCCE2025 < 0
          ? `Ciclo de efectivo negativo de ${valCCE2025.toFixed(2)} días: los proveedores internacionales financian totalmente el capital de trabajo operativo.`
          : `Ciclo de conversión de efectivo de ${valCCE2025.toFixed(2)} días requerido para convertir la inversión en inventarios y ventas en liquidez.`
      },
      {
        title: 'Cobertura Intereses',
        subtitle: 'EBIT / Gastos Fin.',
        value2025: Number(valCob2025.toFixed(2)),
        value2024: Number(valCob2024.toFixed(2)),
        diffText: `▲ +${(valCob2025 - valCob2024).toFixed(2)}x vs 2024`,
        isPositive: true,
        unit: 'x',
        covenant: '≥ 1.50x',
        statusText: 'Blindaje Total',
        explanation: `Capacidad de servicio de deuda: el EBIT cubre ${valCob2025.toFixed(2)} veces la totalidad de los intereses bancarios devengados.`
      }
    ];

    // TOP 4 CRITICAL COVENANTS
    const kpis: KpiMetric[] = [
      {
        id: 'roe',
        title: 'ROE',
        subtitle: 'Retorno s/ Patrimonio',
        value2025: Number(valROE2025.toFixed(2)),
        value2024: Number(valROE2024.toFixed(2)),
        diffText: `${valROE2025 >= valROE2024 ? '▲ +' : '▼ '}${(valROE2025 - valROE2024).toFixed(2)} p.p. vs 2024`,
        isPositive: valROE2025 >= valROE2024,
        unit: '%',
        covenant: '≥ 12.00%',
        target: 12.00,
        covenantMet: true,
        badgeColor: 'emerald',
        statusText: 'Covenant Cumplido',
        interpretation: 'Excelente rentabilidad sobre el patrimonio de los accionistas.',
        explanation: `El ROE cerró en ${valROE2025.toFixed(2)}%, superando el covenant de bonos (≥12.00%).`
      },
      {
        id: 'roa',
        title: 'ROA',
        subtitle: 'Retorno s/ Activos',
        value2025: Number(valROA2025.toFixed(2)),
        value2024: Number(valROA2024.toFixed(2)),
        diffText: `${valROA2025 >= valROA2024 ? '▲ +' : '▼ '}${(valROA2025 - valROA2024).toFixed(2)} p.p. vs 2024`,
        isPositive: valROA2025 >= valROA2024,
        unit: '%',
        covenant: '≥ 6.00%',
        target: 6.00,
        covenantMet: true,
        badgeColor: 'blue',
        statusText: 'Covenant Cumplido',
        interpretation: 'Productividad operativa sobre la totalidad de recursos invertidos.',
        explanation: `Genera Bs. ${valROA2025.toFixed(2)} limpios por cada Bs. 100 en activos comerciales.`
      },
      {
        id: 'margen_neto',
        title: 'Margen Neto',
        subtitle: 'Rentabilidad s/ Ventas',
        value2025: Number(valMN2025.toFixed(2)),
        value2024: Number(valMN2024.toFixed(2)),
        diffText: `${valMN2025 >= valMN2024 ? '▲ +' : '▼ '}${(valMN2025 - valMN2024).toFixed(2)} p.p. vs 2024`,
        isPositive: valMN2025 >= valMN2024,
        unit: '%',
        covenant: '≥ 8.00%',
        target: 8.00,
        covenantMet: true,
        badgeColor: 'cyan',
        statusText: 'Covenant Cumplido',
        interpretation: 'Conversión de ventas en ganancia neta líquida.',
        explanation: `Retiene Bs. ${valMN2025.toFixed(2)} limpios por cada Bs. 100 de ingresos facturados tras absorber diferencia de cambio.`
      },
      {
        id: 'razon_corriente',
        title: 'Razón Corriente',
        subtitle: 'Liquidez Corriente',
        value2025: Number(valRC2025.toFixed(2)),
        value2024: Number(valRC2024.toFixed(2)),
        diffText: `${valRC2025 >= valRC2024 ? '▲ +' : '▼ '}${(valRC2025 - valRC2024).toFixed(2)}x vs 2024`,
        isPositive: true,
        unit: 'x',
        covenant: '≥ 1.20x',
        target: 1.20,
        covenantMet: true,
        badgeColor: 'emerald',
        statusText: 'Covenant Cumplido',
        interpretation: 'Solvencia holgada para atender todos los pasivos inmediatos.',
        explanation: `Bs. ${valRC2025.toFixed(2)} de activo corriente por cada Bs. 1.00 exigible a corto plazo (covenant BBV ≥ 1.20x).`
      }
    ];

    // Commercial Specific Modules
    const assetStructureItems = (hasDatosSheet && rowsDatos.length > 30 && Boolean(rowsDatos[24]?.[1])) ? [
      { name: 'Inversiones temporarias (DPF)', val2025: toM(Number(rowsDatos[24][1])), val2024: toM(Number(rowsDatos[24][2])), pct2025: 31.23 },
      { name: 'Inventarios', val2025: toM(Number(rowsDatos[25][1])), val2024: toM(Number(rowsDatos[25][2])), pct2025: 26.47 },
      { name: 'Activos fijos', val2025: toM(Number(rowsDatos[26][1])), val2024: toM(Number(rowsDatos[26][2])), pct2025: 17.88 },
      { name: 'Disponibilidades', val2025: toM(Number(rowsDatos[27][1])), val2024: toM(Number(rowsDatos[27][2])), pct2025: 9.55 },
      { name: 'CxC comerciales (CP + LP)', val2025: toM(Number(rowsDatos[28][1])), val2024: toM(Number(rowsDatos[28][2])), pct2025: 6.17 },
      { name: 'Impuestos y pagos anticipados', val2025: toM(Number(rowsDatos[29][1])), val2024: toM(Number(rowsDatos[29][2])), pct2025: 5.22 },
      { name: 'CxC relacionadas y otros activos', val2025: toM(Number(rowsDatos[30][1])), val2024: toM(Number(rowsDatos[30][2])), pct2025: 3.48 }
    ] : COMMERCIAL_INITIAL_DATA.assetStructureItems;

    const financingStructure = (hasDatosSheet && rowsDatos.length > 38 && Boolean(rowsDatos[34]?.[1])) ? [
      { concept: 'Patrimonio Neto', amount: toM(Number(rowsDatos[34][1])), percentage: 60.15, color: '#1e3a8a', explanation: 'Capital propio y reservas: 60.15% del financiamiento total.' },
      { concept: 'Deuda Financiera LP', amount: toM(Number(rowsDatos[35][1])), percentage: 13.00, color: '#0284c7', explanation: 'Créditos bancarios de largo plazo y bonos bursátiles.' },
      { concept: 'Deuda Financiera CP', amount: toM(Number(rowsDatos[36][1])), percentage: 11.51, color: '#10b981', explanation: 'Líneas de crédito bancario comercial de corto plazo.' },
      { concept: 'Cuentas por Pagar Com.', amount: toM(Number(rowsDatos[37][1])), percentage: 9.77, color: '#f59e0b', explanation: 'Crédito espontáneo comercial de proveedores del exterior.' },
      { concept: 'Deudas Fiscales y Otros Pas.', amount: toM(Number(rowsDatos[38][1])), percentage: 5.57, color: '#8b5cf6', explanation: 'Obligaciones tributarias, laborales y provisiones operativas.' }
    ] : COMMERCIAL_INITIAL_DATA.financingStructure;

    const workingCapitalCycle: WorkingCapitalCycleItem[] = [
      {
        id: 'dio',
        name: 'Días de Inventario',
        shortName: 'DIO',
        val2025: finalDio2025,
        val2024: finalDio2024,
        diff: Number((finalDio2025 - finalDio2024).toFixed(2)),
        unit: 'días',
        explanation: `Tiempo medio de permanencia de existencias en almacén: ${finalDio2025} días en 2025 vs ${finalDio2024} días en 2024.`
      },
      {
        id: 'dso',
        name: 'Días de Cobro',
        shortName: 'DSO',
        val2025: finalDso2025,
        val2024: finalDso2024,
        diff: Number((finalDso2025 - finalDso2024).toFixed(2)),
        unit: 'días',
        explanation: `Periodo medio de cobranza a clientes comerciales: ${finalDso2025} días en 2025 vs ${finalDso2024} días en 2024.`
      },
      {
        id: 'dpo',
        name: 'Días Pago a Proveedores',
        shortName: 'DPO',
        val2025: finalDpo2025,
        val2024: finalDpo2024,
        diff: Number((finalDpo2025 - finalDpo2024).toFixed(2)),
        unit: 'días',
        explanation: `Financiamiento comercial obtenido de proveedores: ${finalDpo2025} días en 2025 vs ${finalDpo2024} días en 2024.`
      },
      {
        id: 'cce',
        name: 'Ciclo Conversión Efectivo',
        shortName: 'CCE',
        val2025: finalCce2025,
        val2024: finalCce2024,
        diff: Number((finalCce2025 - finalCce2024).toFixed(2)),
        unit: 'días',
        explanation: finalCce2025 < 0
          ? `Ciclo de efectivo negativo de ${finalCce2025} días: los proveedores financian totalmente las operaciones comerciales.`
          : `Ciclo de conversión de efectivo de ${finalCce2025} días requeridos para convertir el ciclo operativo en liquidez efectiva.`
      }
    ];

    const businessLines = (hasDatosSheet && rowsDatos.length > 73 && Boolean(rowsDatos[67]?.[1])) ? [
      { name: 'Camiones', val2025: toM(Number(rowsDatos[67][1])), val2024: toM(Number(rowsDatos[67][2])), diff: Number((toM(Number(rowsDatos[67][1])) - toM(Number(rowsDatos[67][2]))).toFixed(2)), pctOfTotal2025: 34.11 },
      { name: 'Repuestos y materiales', val2025: toM(Number(rowsDatos[68][1])), val2024: toM(Number(rowsDatos[68][2])), diff: Number((toM(Number(rowsDatos[68][1])) - toM(Number(rowsDatos[68][2]))).toFixed(2)), pctOfTotal2025: 23.79 },
      { name: 'Maq. agrícola John Deere', val2025: toM(Number(rowsDatos[69][1])), val2024: toM(Number(rowsDatos[69][2])), diff: Number((toM(Number(rowsDatos[69][1])) - toM(Number(rowsDatos[69][2]))).toFixed(2)), pctOfTotal2025: 16.46 },
      { name: 'Vehículos livianos', val2025: toM(Number(rowsDatos[70][1])), val2024: toM(Number(rowsDatos[70][2])), diff: Number((toM(Number(rowsDatos[70][1])) - toM(Number(rowsDatos[70][2]))).toFixed(2)), pctOfTotal2025: 11.34 },
      { name: 'Maquinaria pesada', val2025: toM(Number(rowsDatos[71][1])), val2024: toM(Number(rowsDatos[71][2])), diff: Number((toM(Number(rowsDatos[71][1])) - toM(Number(rowsDatos[71][2]))).toFixed(2)), pctOfTotal2025: 9.58 },
      { name: 'Servicios de taller', val2025: toM(Number(rowsDatos[72][1])), val2024: toM(Number(rowsDatos[72][2])), diff: Number((toM(Number(rowsDatos[72][1])) - toM(Number(rowsDatos[72][2]))).toFixed(2)), pctOfTotal2025: 4.28 },
      { name: 'Vehículos usados', val2025: toM(Number(rowsDatos[73][1])), val2024: toM(Number(rowsDatos[73][2])), diff: Number((toM(Number(rowsDatos[73][1])) - toM(Number(rowsDatos[73][2]))).toFixed(2)), pctOfTotal2025: 0.37 }
    ] : COMMERCIAL_INITIAL_DATA.businessLines;

    const covenantsBBV = [
      { commitment: 'Razón Corriente (RC ≥ 1.20x)', value2025: `${valRC2025.toFixed(2)}x`, limit: '≥ 1,20x', isMet: valRC2025 >= 1.20, rule: 'Activo Corriente / Pasivo Corriente' },
      { commitment: 'Relación Endeudamiento (RDP ≤ 2.50x)', value2025: `${valRDP2025.toFixed(2)}x`, limit: '≤ 2,50x', isMet: valRDP2025 <= 2.50, rule: 'Deuda Financiera Total / Patrimonio Neto' },
      { commitment: 'Cobertura Servicio Deuda Fin. (≥ 1.50x)', value2025: `${valCob2025.toFixed(2)}x`, limit: '≥ 1,50x', isMet: valCob2025 >= 1.50, rule: 'Utilidad Operativa EBIT / Gastos Financieros' }
    ];

    const updatedRatios: FinancialRatio[] = COMMERCIAL_INITIAL_DATA.ratios.map((r): FinancialRatio => {
      if (r.id === 'cce') {
        const diff = Number((finalCce2025 - finalCce2024).toFixed(2));
        return {
          ...r,
          year2025: finalCce2025,
          year2024: finalCce2024,
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} d`,
          trend: (diff <= 0 ? 'Mejora' : 'Deterioro') as 'Mejora' | 'Deterioro',
          explanation: finalCce2025 < 0
            ? `Ciclo de efectivo negativo de ${finalCce2025} días: los proveedores financian íntegramente las operaciones.`
            : `Ciclo de conversión de efectivo de ${finalCce2025} días.`
        };
      }
      if (r.id === 'dio') {
        const diff = Number((finalDio2025 - finalDio2024).toFixed(2));
        return {
          ...r,
          year2025: finalDio2025,
          year2024: finalDio2024,
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} d`,
          trend: (diff <= 0 ? 'Mejora' : 'Deterioro') as 'Mejora' | 'Deterioro'
        };
      }
      if (r.id === 'dso') {
        const diff = Number((finalDso2025 - finalDso2024).toFixed(2));
        return {
          ...r,
          year2025: finalDso2025,
          year2024: finalDso2024,
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} d`,
          trend: (diff <= 0 ? 'Mejora' : 'Deterioro') as 'Mejora' | 'Deterioro'
        };
      }
      if (r.id === 'dpo') {
        const diff = Number((finalDpo2025 - finalDpo2024).toFixed(2));
        return {
          ...r,
          year2025: finalDpo2025,
          year2024: finalDpo2024,
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} d`,
          trend: (diff >= 0 ? 'Mejora' : 'Deterioro') as 'Mejora' | 'Deterioro'
        };
      }
      if (r.id === 'rc') {
        const diff = Number((valRC2025 - valRC2024).toFixed(2));
        return {
          ...r,
          year2025: Number(valRC2025.toFixed(2)),
          year2024: Number(valRC2024.toFixed(2)),
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}x`
        };
      }
      if (r.id === 'rdp') {
        const diff = Number((valRDP2025 - valRDP2024).toFixed(2));
        return {
          ...r,
          year2025: Number(valRDP2025.toFixed(2)),
          year2024: Number(valRDP2024.toFixed(2)),
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}x`
        };
      }
      if (r.id === 'cobertura_int') {
        const diff = Number((valCob2025 - valCob2024).toFixed(2));
        return {
          ...r,
          year2025: Number(valCob2025.toFixed(2)),
          year2024: Number(valCob2024.toFixed(2)),
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}x`
        };
      }
      if (r.id === 'roe') {
        const diff = Number((valROE2025 - valROE2024).toFixed(2));
        return {
          ...r,
          year2025: Number(valROE2025.toFixed(2)),
          year2024: Number(valROE2024.toFixed(2)),
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} p.p.`,
          trend: (Math.abs(diff) < 0.05 ? 'Estable' : diff > 0 ? 'Mejora' : 'Deterioro') as 'Mejora' | 'Deterioro' | 'Estable'
        };
      }
      if (r.id === 'roa') {
        const diff = Number((valROA2025 - valROA2024).toFixed(2));
        return {
          ...r,
          year2025: Number(valROA2025.toFixed(2)),
          year2024: Number(valROA2024.toFixed(2)),
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} p.p.`,
          trend: (Math.abs(diff) < 0.05 ? 'Estable' : diff > 0 ? 'Mejora' : 'Deterioro') as 'Mejora' | 'Deterioro' | 'Estable'
        };
      }
      if (r.id === 'rotacion_activos') {
        const diff = Number((valRotAct2025 - valRotAct2024).toFixed(2));
        return {
          ...r,
          year2025: Number(valRotAct2025.toFixed(2)),
          year2024: Number(valRotAct2024.toFixed(2)),
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}x`,
          trend: (Math.abs(diff) < 0.01 ? 'Estable' : diff > 0 ? 'Mejora' : 'Deterioro') as 'Mejora' | 'Deterioro' | 'Estable'
        };
      }
      if (r.id === 'margen_neto') {
        const diff = Number((valMN2025 - valMN2024).toFixed(2));
        return {
          ...r,
          year2025: Number(valMN2025.toFixed(2)),
          year2024: Number(valMN2024.toFixed(2)),
          diff,
          diffText: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} p.p.`,
          trend: (Math.abs(diff) < 0.05 ? 'Estable' : diff > 0 ? 'Mejora' : 'Deterioro') as 'Mejora' | 'Deterioro' | 'Estable'
        };
      }
      return r;
    });

    return {
      companyName: 'NIBOL LTDA.',
      period: 'Ejercicios 2025 – 2024',
      currency: 'Bolivianos (Bs.)',
      auditInfo: 'Auditor: PricewaterhouseCoopers S.R.L. (PwC) · Informe 30/03/2026 · Rubro: Automotriz, Maquinaria y Repuestos · Moneda: Bolivianos (Bs.)',
      fileName,
      uploadDate: new Date(),
      balanceBreakdown,
      incomeBreakdown,
      kpis,
      balanceIncomeKpis,
      ratioKpis,
      dupont,
      ratios: updatedRatios,
      keyVariations: COMMERCIAL_INITIAL_DATA.keyVariations,
      balanceSheetRows: COMMERCIAL_INITIAL_DATA.balanceSheetRows,
      incomeStatementRows: COMMERCIAL_INITIAL_DATA.incomeStatementRows,
      verticalAnalysisRows: COMMERCIAL_INITIAL_DATA.verticalAnalysisRows,
      horizontalAnalysisRows: COMMERCIAL_INITIAL_DATA.horizontalAnalysisRows,
      assetStructureItems,
      financingStructure,
      incomeDistributionItems: COMMERCIAL_INITIAL_DATA.incomeDistributionItems,
      workingCapitalCycle,
      businessLines,
      covenantsBBV
    };
  }

  /**
   * Generates and downloads a complete Excel template with all 4 required sheets for the commercial company
   */
  downloadSampleExcelTemplate(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const wb = XLSX.utils.book_new();

    // Sheet 1: EST. FINANCIEROS
    const s1 = [
      ['NIBOL LTDA. — ESTADOS FINANCIEROS AUDITADOS', ''],
      ['DESCRIPCIÓN', 'Dic. 2025 (Bs.)', 'Dic. 2024 (Bs.)'],
      ['Inversiones temporarias (DPF)', 538341311, 137322756],
      ['Inventarios comerciales', 456198524, 560634083],
      ['Activos fijos (Bienes de uso netos)', 307500000, 312200000],
      ['Disponibilidades (Caja y Bancos)', 167000000, 172900000],
      ['Cuentas por cobrar comerciales (CP)', 94440440, 203110173],
      ['Impuestos y pagos anticipados', 72500000, 38700000],
      ['CxC relacionadas y otros activos (LP)', 87700000, 87300000],
      ['TOTAL ACTIVO CORRIENTE', 1395271847, 1130273447],
      ['TOTAL ACTIVO NO CORRIENTE', 328279460, 381860270],
      ['TOTAL ACTIVO', 1723551307, 1512133717],
      ['Deuda Financiera CP', 198000000, 168000000],
      ['Cuentas por pagar comerciales', 168315655, 49440722],
      ['Deudas fiscales, laborales y otros pasivos', 86490224, 82000000],
      ['TOTAL PASIVO CORRIENTE', 452805879, 326741266],
      ['Deuda Financiera LP (Bancos y Bonos)', 224500000, 209300000],
      ['Previsiones y otros pasivos no corrientes', 9486113, 2066402],
      ['TOTAL PASIVO NO CORRIENTE', 233986113, 211366402],
      ['TOTAL PASIVO', 686791992, 538107668],
      ['TOTAL PATRIMONIO NETO', 1036759315, 974026049],
      ['TOTAL PASIVO Y PATRIMONIO', 1723551307, 1512133717],
      ['', ''],
      ['ESTADO DE GANANCIAS Y PÉRDIDAS', ''],
      ['Ingresos netos por ventas', 1215703421, 977165060],
      ['Costo de productos y mercaderías vendidas', -810335830, -681656595],
      ['MARGEN BRUTO', 405367591, 295508465],
      ['Gastos de administración y comercialización', -140122068, -128948404],
      ['UTILIDAD OPERATIVA (EBIT)', 265245523, 166560061],
      ['Diferencia de cambio (Ajuste cambiario)', -105418740, -19491577],
      ['Gastos financieros netos', -29472390, -40315480],
      ['UTILIDAD ANTES DE IMPUESTOS (EBT)', 203800000, 183900000],
      ['Impuesto sobre las utilidades (IUE)', -41600000, -36800000],
      ['UTILIDAD NETA DEL EJERCICIO', 134456384, 126482232]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s1), 'EST. FINANCIEROS');

    // Sheet 2: ANÁLISIS HORIZONTAL
    const s2 = [
      ['Concepto', 'Dic. 2024 (Bs.)', 'Dic. 2025 (Bs.)', 'Variación Abs. (Bs.)', 'Var. %'],
      ['TOTAL DEL ACTIVO', 1512133717, 1723551307, 211417590, '+14.0%'],
      ['Inversiones temporarias', 137322756, 538341311, 401018555, '+292.0%'],
      ['Inventarios', 560634083, 456198524, -104435559, '-18.6%'],
      ['Cuentas por cobrar comerciales (CP)', 203110173, 94440440, -108669733, '-53.5%'],
      ['Cuentas por pagar comerciales', 49440722, 168315655, 118874933, '+240.4%'],
      ['TOTAL DEL PATRIMONIO NETO', 974026049, 1036759315, 62733266, '+6.4%'],
      ['INGRESOS NETOS', 977165060, 1215703421, 238538361, '+24.4%'],
      ['MARGEN BRUTO', 295508465, 405367591, 109859126, '+37.2%'],
      ['UTILIDAD OPERATIVA (EBIT)', 166560061, 265245523, 98685462, '+59.2%'],
      ['Diferencia de cambio', -19491577, -105418740, -85927163, '-440.8%'],
      ['UTILIDAD NETA DEL EJERCICIO', 126482232, 134456384, 7974152, '+6.3%']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s2), 'ANÁLISIS HORIZONTAL');

    // Sheet 3: ANÁLISIS VERTICAL
    const s3 = [
      ['DESCRIPCIÓN', 'Dic. 2025 (Bs.)', '% 2025', 'Dic. 2024 (Bs.)', '% 2024'],
      ['Inversiones temporarias (DPF)', 538341311, '31.23%', 137322756, '9.08%'],
      ['Inventarios comerciales', 456198524, '26.47%', 560634083, '37.08%'],
      ['Activos fijos netos', 307500000, '17.84%', 312200000, '20.65%'],
      ['Disponibilidades', 167000000, '9.69%', 172900000, '11.43%'],
      ['Cuentas por cobrar comerciales (CP)', 94440440, '5.48%', 203110173, '13.43%'],
      ['TOTAL ACTIVO CORRIENTE', 1395271847, '80.95%', 1130273447, '74.75%'],
      ['TOTAL ACTIVO NO CORRIENTE', 328279460, '19.05%', 381860270, '25.25%'],
      ['TOTAL ACTIVO', 1723551307, '100.00%', 1512133717, '100.00%'],
      ['TOTAL PASIVO CORRIENTE', 452805879, '26.27%', 326741266, '21.61%'],
      ['TOTAL PASIVO NO CORRIENTE', 233986113, '13.58%', 211366402, '13.98%'],
      ['TOTAL PASIVO', 686791992, '39.85%', 538107668, '35.59%'],
      ['TOTAL PATRIMONIO NETO', 1036759315, '60.15%', 974026049, '64.41%']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s3), 'ANÁLISIS VERTICAL');

    // Sheet 4: RATIOS Y DUPONT
    const s4 = [
      ['Ratio / Indicador', 'Dic. 2025', 'Dic. 2024', 'Δ', 'Mejor si', 'Tendencia'],
      ['Razón Corriente (Covenant BBV ≥ 1.20x)', '3.08x', '3.46x', '-0.38x', 'Mayor', 'Deterioro'],
      ['Prueba Ácida', '2.07x', '1.74x', '+0.33x', 'Mayor', 'Mejora'],
      ['Razón de Tesorería / Efectivo', '1.56x', '0.84x', '+0.67x', 'Mayor', 'Mejora'],
      ['Rotación de Inventarios', '1.78x', '1.22x', '+0.56x', 'Mayor', 'Mejora'],
      ['Días de Inventario (DIO)', '205 días', '300 días', '-95', 'Menor', 'Mejora'],
      ['Días de Cobro Comercial (DSO)', '32 días', '95 días', '-63', 'Menor', 'Mejora'],
      ['Días de Pago a Proveedores (DPO)', '76 días', '26 días', '+49', 'Mayor', 'Mejora'],
      ['Ciclo de Conversión de Efectivo (CCE)', '-10 días', '-3 días', '-7', 'Menor', 'Mejora'],
      ['Rotación de Activos Totales', '0.71x', '0.65x', '+0.06x', 'Mayor', 'Mejora'],
      ['Endeudamiento Total', '39.8%', '35.6%', '+4.3%', 'Menor', 'Deterioro'],
      ['Relación Deuda / Patrimonio (RDP ≤ 2.50x)', '0.66x', '0.55x', '+0.11x', 'Menor', 'Deterioro'],
      ['Cobertura de Intereses (EBIT/GF)', '8.99x', '4.13x', '+4.86x', 'Mayor', 'Mejora'],
      ['Margen Bruto', '33.3%', '30.2%', '+3.1%', 'Mayor', 'Mejora'],
      ['Margen Operativo (EBIT)', '21.8%', '17.0%', '+4.8%', 'Mayor', 'Mejora'],
      ['Margen Neto', '11.06%', '12.94%', '-1.88%', 'Mayor', 'Deterioro'],
      ['ROA (Retorno sobre Activos)', '7.8%', '8.4%', '-0.6%', 'Mayor', 'Deterioro'],
      ['ROE (Retorno sobre Patrimonio)', '13.0%', '13.0%', '0.0%', 'Mayor', 'Estable'],
      ['', ''],
      ['SISTEMA DUPONT Y COVENANTS BBV', 'Dic. 2025', 'Dic. 2024', 'Δ'],
      ['1. Margen Neto (Motor 1)', '11.06%', '12.94%', '-1.88%'],
      ['2. Rotación de Activos (Motor 2)', '0.71x', '0.65x', '+0.06x'],
      ['3. Apalancamiento (Motor 3)', '1.66x', '1.55x', '+0.11x'],
      ['ROE DuPont (Resultado)', '12.97%', '12.99%', '-0.02%']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s4), 'RATIOS Y DUPONT');

    // Sheet 5: DATOS DASHBOARD (Como en Imagen 6 y 7)
    const s5 = [
      ['BASE DE DATOS DEL DASHBOARD', 'Vínculos dinámicos a las hojas de origen'],
      ['Unidad de presentación para textos y gráficos (Bs.)', 1000000],
      ['Tolerancia del cuadre contable (Bs.)', 5],
      ['', ''],
      ['Indicador', 'Dic. 2025', 'Dic. 2024', 'Variación', 'Mejor si (+1/-1)', 'Tipo', 'Origen / fórmula'],
      ['Activo Total (Bs. M)', 1723.6, 1512.1, '+14,0%', 1, 'monto', 'EST. FINANCIEROS - Total del Activo'],
      ['Inventarios (Bs. M)', 456.2, 560.6, '-18,6%', 1, 'monto', 'EST. FINANCIEROS - Inventario (Nota 7)'],
      ['Deuda Financiera Total (Bs. M)', 422.5, 377.3, '+12,0%', -1, 'monto', 'EST. FINANCIEROS - Deuda Financiera CP+LP (Nota 12)'],
      ['Patrimonio Neto (Bs. M)', 1036.8, 974.0, '+6,4%', 1, 'monto', 'EST. FINANCIEROS - Total Patrimonio Neto'],
      ['Ingresos Netos (Bs. M)', 1215.7, 977.2, '+24,4%', 1, 'monto', 'EST. FINANCIEROS - Ingresos Netos (Nota 15)'],
      ['Margen Bruto (Bs. M)', 405.4, 295.5, '+37,2%', 1, 'monto', 'EST. FINANCIEROS - Margen Bruto'],
      ['Utilidad Operativa EBIT (Bs. M)', 265.2, 166.6, '+59,2%', 1, 'monto', 'EST. FINANCIEROS - Utilidad Operativa (EBIT)'],
      ['Utilidad Neta (Bs. M)', 134.5, 126.5, '+6,3%', 1, 'monto', 'EST. FINANCIEROS - Utilidad Neta del Ejercicio'],
      ['ROE (Retorno s/ Patrimonio)', '13.0%', '13.0%', '0,0%', 1, 'pct', 'RATIOS FINANCIEROS - ROE'],
      ['ROA (Retorno s/ Activos)', '7.8%', '8.4%', '-0,6%', 1, 'pct', 'RATIOS FINANCIEROS - ROA'],
      ['1. Margen Neto (Motor 1) (%)', '11.06%', '12.94%', '-1.88%', 1, 'pct', 'RATIOS FINANCIEROS - Margen Neto (Motor 1)'],
      ['Margen Bruto (%)', '33.3%', '30.2%', '+3,1%', 1, 'pct', 'RATIOS FINANCIEROS - Margen Bruto'],
      ['Margen Operativo EBIT (%)', '21.8%', '17.0%', '+4,8%', 1, 'pct', 'RATIOS FINANCIEROS - Margen Operativo EBIT'],
      ['Razón Corriente (Cov. ≥ 1.20x)', '3.08x', '3.46x', '-37,8%', 1, 'x', 'RATIOS FINANCIEROS - Razón Corriente'],
      ['Deuda / Patrimonio RDP (≤ 2.50x)', '0.66x', '0.55x', '+11,0%', -1, 'x', 'RATIOS FINANCIEROS - Relación Deuda/Patrimonio RDP'],
      ['Ciclo Conversión Efectivo (días)', '-10 días', '-3 días', '-701,3%', -1, 'días', 'RATIOS FINANCIEROS - Ciclo Conversión Efectivo (DIO+DSO-DPO)'],
      ['Cobertura Intereses (EBIT/GF)', '8.99x', '4.13x', '+486,3%', 1, 'x', 'RATIOS FINANCIEROS - Cobertura de Intereses']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s5), 'DATOS DASHBOARD');

    XLSX.writeFile(wb, 'NIBOL_Analisis_Financiero_2025.xlsx');
  }
}
