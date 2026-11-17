import { TestBed } from '@angular/core/testing';
import { FinancialDataService } from './financial-data.service';
import * as XLSX from 'xlsx';

describe('FinancialDataService', () => {
  let service: FinancialDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with report and be cleanable with clearData() for a new Excel file', () => {
    expect(service.report()).not.toBeNull();
    service.clearData();
    expect(service.report()).toBeNull();
    expect(service.hasUploadedFile()).toBe(false);
    expect(service.currentFileName()).toBeNull();
  });

  it('should load demo data when loadSampleData() is called and clear when clearData() is called', () => {
    service.loadSampleData();
    expect(service.report()).not.toBeNull();
    expect(service.report()?.companyName).toContain('NIBOL');
    expect(service.kpis().length).toBe(4);

    // Now test clearData()
    service.clearData();
    expect(service.report()).toBeNull();
    expect(service.currentFileName()).toBeNull();
    expect(service.hasUploadedFile()).toBe(false);
  });

  it('should parse an uploaded Excel workbook with 4 sheets correctly', async () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Estados_Financiero
    const s1 = [
      ['ESTADOS FINANCIEROS AUDITADOS', ''],
      ['DESCRIPCIÓN', 'Dic. 2025 (Bs.)', 'Dic. 2024 (Bs.)'],
      ['Total activo corriente', 1395271847, 1130273447],
      ['Total activo no corriente', 328279460, 381860270],
      ['TOTAL ACTIVO', 1723551307, 1512133717],
      ['Total pasivo corriente', 452805879, 326741266],
      ['Total pasivo no corriente', 233986113, 211366402],
      ['TOTAL PASIVO', 686791992, 538107668],
      ['TOTAL PATRIMONIO', 1036759315, 974026049],
      ['Ingresos netos', 1215703421, 977165060],
      ['Costo de productos y servicios', -810335830, -681656595],
      ['MARGEN BRUTO', 405367591, 295508465],
      ['UTILIDAD OPERATIVA', 265245523, 166560061],
      ['UTILIDAD NETA DEL EJERCICIO', 134456384, 126482232]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s1), 'Estados_Financiero');

    // Sheet 2: ANÁLISIS HORIZONTAL
    const s2 = [
      ['DESCRIPCIÓN', 'Dic. 2025 (Bs.)', 'Dic. 2024 (Bs.)', 'Absoluta (Bs.)', 'Relativa (%)'],
      ['Total activo corriente', 1395271847, 1130273447, 264998400, '23.45%']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s2), 'ANÁLISIS HORIZONTAL');

    // Sheet 3: ANÁLISIS VERTICAL
    const s3 = [
      ['DESCRIPCIÓN', 'Dic. 2025 (Bs.)', '% 2025', 'Dic. 2024 (Bs.)', '% 2024'],
      ['Total activo corriente', 1395271847, '80.95%', 1130273447, '74.75%']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s3), 'ANÁLISIS VERTICAL');

    // Sheet 4: RATIOS Y DUPONT
    const s4 = [
      ['PARÁMETRO', 'Componentes', '2025', '2024'],
      ['Razón Corriente', 'Activo Corriente / Pasivo Corriente', 3.08, 3.46],
      ['Margen Neto', 'Utilidad Neta / Ventas', '11.06%', '12.94%'],
      ['ROA (Retorno sobre Activos)', 'Utilidad Neta / Activos Totales', '7.80%', '8.36%'],
      ['ROE (Retorno sobre Patrimonio)', 'Utilidad Neta / Patrimonio', '12.97%', '12.99%'],
      ['Rotación de Activos (Eficiencia)', 'Ventas / Activos Totales', 0.71, 0.65],
      ['Apalancamiento Financiero (Multiplicador)', 'Activos Totales / Patrimonio', 1.66, 1.55]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s4), 'RATIOS Y DUPONT');

    const u8 = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new File([u8], 'Nuevo_Archivo_Empresa.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    await service.processExcelFile(file);

    expect(service.hasUploadedFile()).toBe(true);
    expect(service.currentFileName()).toBe('Nuevo_Archivo_Empresa.xlsx');
    expect(service.report()).not.toBeNull();
    expect(service.report()?.kpis.length).toBe(4);
    expect(service.report()?.dupont.roe.year2025).toBe(12.97);
  });
});
