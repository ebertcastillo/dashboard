import { FinancialReport } from '../models/financial.model';

export const COMMERCIAL_INITIAL_DATA: FinancialReport = {
  companyName: 'NIBOL LTDA.',
  period: 'ANÁLISIS FINANCIERO INTEGRAL · Ejercicios 2025 – 2024',
  currency: 'Bolivianos (Bs.)',
  auditInfo: 'Auditor: PricewaterhouseCoopers S.R.L. (PwC) · Informe 30/03/2026 · Rubro: Automotriz, Maquinaria y Repuestos · Moneda: Bolivianos (Bs.)',
  fileName: 'NIBOL_Analisis_Financiero_2025.xlsx',
  uploadDate: new Date(),

  balanceBreakdown: {
    currentAssets2025: 1395.27,
    currentAssets2024: 1130.27,
    pctCurrentAssets2025: 80.95,
    pctCurrentAssets2024: 74.75,

    nonCurrentAssets2025: 328.28,
    nonCurrentAssets2024: 381.86,
    pctNonCurrentAssets2025: 19.05,
    pctNonCurrentAssets2024: 25.25,

    totalAssets2025: 1723.55,
    totalAssets2024: 1512.13,

    currentLiabilities2025: 452.81,
    currentLiabilities2024: 326.74,
    pctCurrentLiabilities2025: 26.27,
    pctCurrentLiabilities2024: 21.61,

    nonCurrentLiabilities2025: 233.99,
    nonCurrentLiabilities2024: 211.37,
    pctNonCurrentLiabilities2025: 13.58,
    pctNonCurrentLiabilities2024: 13.98,

    totalLiabilities2025: 686.79,
    totalLiabilities2024: 538.11,
    pctTotalLiabilities2025: 39.85,
    pctTotalLiabilities2024: 35.59,

    equity2025: 1036.76,
    equity2024: 974.03,
    pctEquity2025: 60.15,
    pctEquity2024: 64.41
  },

  incomeBreakdown: {
    netRevenue2025: 1215.70,
    netRevenue2024: 977.17,
    costOfSales2025: 810.34,
    costOfSales2024: 681.66,
    grossProfit2025: 405.37,
    grossProfit2024: 295.51,
    operatingExpenses2025: 140.12,
    operatingExpenses2024: 128.95,
    operatingProfit2025: 265.25, // EBIT
    operatingProfit2024: 166.56,
    financialExpenses2025: 29.50,
    financialExpenses2024: 40.32,
    profitBeforeTax2025: 203.78, // EBT
    profitBeforeTax2024: 183.89,
    taxes2025: 41.56,
    taxes2024: 36.78,
    netProfit2025: 134.46,
    netProfit2024: 126.48
  },

  // 4 TOP CRITICAL KPIS
  kpis: [
    {
      id: 'roe',
      title: 'ROE',
      subtitle: 'Retorno s/ Patrimonio',
      value2025: 12.97,
      value2024: 12.99,
      diffText: '▼ -0,02 p.p. vs 2024',
      isPositive: true,
      unit: '%',
      covenant: '≥ 12.00%',
      target: 12.00,
      covenantMet: true,
      badgeColor: 'emerald',
      statusText: 'Covenant Cumplido',
      interpretation: 'Excelente rentabilidad patrimonial del 12.97%, superando el covenant de bonos (≥12.00%).',
      explanation: 'La rentabilidad sobre el patrimonio se mantuvo sólida y estable en 12.97%, sostenida por una mayor rotación de activos y apalancamiento que contrarrestaron la contracción en el margen neto.'
    },
    {
      id: 'roa',
      title: 'ROA',
      subtitle: 'Retorno s/ Activos',
      value2025: 7.80,
      value2024: 8.36,
      diffText: '▼ -0,56 p.p. vs 2024',
      isPositive: false,
      unit: '%',
      covenant: '≥ 6.00%',
      target: 6.00,
      covenantMet: true,
      badgeColor: 'blue',
      statusText: 'Covenant Cumplido',
      interpretation: 'Alta productividad de activos comerciales: genera Bs. 7.80 limpios por cada Bs. 100 en recursos.',
      explanation: 'El ROA se ubicó en 7.80% debido al rápido crecimiento de activos en inversiones financieras DPF, manteniendo un nivel muy superior al estándar del sector comercial.'
    },
    {
      id: 'margen_neto',
      title: 'Margen Neto',
      subtitle: 'Rentabilidad s/ Ventas',
      value2025: 11.06,
      value2024: 12.94,
      diffText: '▼ -1,88 p.p. vs 2024',
      isPositive: false,
      unit: '%',
      covenant: '≥ 8.00%',
      target: 8.00,
      covenantMet: true,
      badgeColor: 'cyan',
      statusText: 'Covenant Cumplido',
      interpretation: 'Retiene Bs. 11.06 limpios por cada Bs. 100 de ingresos facturados.',
      explanation: 'Compresión temporal de 1.88 p.p. provocada por el costo no recurrente de diferencia de cambio (-Bs. 105.42M) ante variaciones cambiarias en importaciones de maquinaria y vehículos.'
    },
    {
      id: 'razon_corriente',
      title: 'Razón Corriente',
      subtitle: 'Liquidez Corriente',
      value2025: 3.08,
      value2024: 3.46,
      diffText: '▼ -0,38x vs 2024',
      isPositive: true,
      unit: 'x',
      covenant: '≥ 1.20x',
      target: 1.20,
      covenantMet: true,
      badgeColor: 'emerald',
      statusText: 'Holgura Total',
      interpretation: 'Bs. 3.08 de activo corriente por cada Bs. 1.00 de deuda exigible a corto plazo.',
      explanation: 'Sólida liquidez corriente que supera por más de 2.5 veces el covenant financiero de bonos BBV (límite contractual ≥ 1.20x).'
    }
  ],

  // CINTA 1: BALANCE GENERAL Y ESTADO DE GANANCIAS Y PÉRDIDAS (8 TARJETAS - IMAGEN 1)
  balanceIncomeKpis: [
    {
      title: 'Activo Total (Bs. M)',
      subtitle: 'Recursos Totales',
      value2025: 1723.55,
      value2024: 1512.13,
      diffText: '▲ +13,98% vs 2024',
      isPositive: true,
      unit: '',
      isCurrency: false,
      explanation: 'Expansión de activos impulsada por mayores colocaciones en DPFs temporarios (Bs. 538.34M) y modernización operativa (+13.98%).'
    },
    {
      title: 'Inventarios (Bs. M)',
      subtitle: 'Stock de Mercaderías',
      value2025: 456.20,
      value2024: 560.60,
      diffText: '▼ -18,62% vs 2024',
      isPositive: true,
      unit: '',
      isCurrency: false,
      explanation: 'Excelente gestión logística y comercial: optimización del inventario con disminución del 18.62% y reducción de días de permanencia a 205.49 días.'
    },
    {
      title: 'Deuda Financiera Total (Bs. M)',
      subtitle: 'Bancos y Emisiones',
      value2025: 422.47,
      value2024: 377.30,
      diffText: '▲ +11,97% vs 2024',
      isPositive: false,
      unit: '',
      isCurrency: false,
      explanation: 'Incremento moderado del 11.97% en financiamiento bancario y bonos corporativos, estructurado mayormente a largo plazo (Bs. 224.14M).'
    },
    {
      title: 'Patrimonio Neto (Bs. M)',
      subtitle: 'Capital y Reservas',
      value2025: 1036.76,
      value2024: 974.03,
      diffText: '▲ +6,44% vs 2024',
      isPositive: true,
      unit: '',
      isCurrency: false,
      explanation: 'Fortalecimiento patrimonial (+6.44%) por reinversión de utilidades líquidas, alcanzando el 60.15% de financiamiento de los activos totales.'
    },
    {
      title: 'Ingresos Netos (Bs. M)',
      subtitle: 'Ventas Comerciales',
      value2025: 1215.70,
      value2024: 977.17,
      diffText: '▲ +24,41% vs 2024',
      isPositive: true,
      unit: '',
      isCurrency: false,
      explanation: 'Crecimiento extraordinario del 24.41% en ventas comerciales, liderado por la venta de camiones, repuestos y maquinaria agrícola John Deere.'
    },
    {
      title: 'Margen Bruto (Bs. M)',
      subtitle: 'Ganancia Comercial',
      value2025: 405.37,
      value2024: 295.51,
      diffText: '▲ +37,17% vs 2024',
      isPositive: true,
      unit: '',
      isCurrency: false,
      explanation: 'Fuerte salto del 37.17% en el margen bruto gracias a mejores precios unitarios de venta y sinergias comerciales en repuestos y servicios.'
    },
    {
      title: 'Utilidad Operativa EBIT (Bs. M)',
      subtitle: 'Resultado de Operaciones',
      value2025: 265.25,
      value2024: 166.56,
      diffText: '▲ +59,25% vs 2024',
      isPositive: true,
      unit: '',
      isCurrency: false,
      explanation: 'Crecimiento del 59.25% en la utilidad operativa debido al apalancamiento operativo de la estructura de costos comerciales.'
    },
    {
      title: 'Utilidad Neta (Bs. M)',
      subtitle: 'Resultado Final del Ejercicio',
      value2025: 134.46,
      value2024: 126.48,
      diffText: '▲ +6,31% vs 2024',
      isPositive: true,
      unit: '',
      isCurrency: false,
      explanation: 'Ganancia líquida final de Bs. 134.46 millones (+6.31%), absorbiendo íntegramente la carga de diferencia de cambio de Bs. 105.42M.'
    }
  ],

  // CINTA 2: RENTABILIDAD, ACTIVIDAD AUTOMOTRIZ, LIQUIDEZ Y COVENANTS BBV (8 TARJETAS - IMAGEN 1)
  ratioKpis: [
    {
      title: 'ROE',
      subtitle: 'Retorno s/ Patrimonio',
      value2025: 12.97,
      value2024: 12.99,
      diffText: '▼ -0,02 p.p. vs 2024',
      isPositive: true,
      unit: '%',
      covenant: '≥ 12.00%',
      statusText: 'Cumplido',
      explanation: 'Genera Bs. 12.97 limpios por cada Bs. 100 de patrimonio de los accionistas, cumpliendo el covenant BBV.'
    },
    {
      title: 'ROA',
      subtitle: 'Retorno s/ Activos',
      value2025: 7.80,
      value2024: 8.36,
      diffText: '▼ -0,56 p.p. vs 2024',
      isPositive: false,
      unit: '%',
      covenant: '≥ 6.00%',
      statusText: 'Cumplido',
      explanation: 'Elevado retorno sobre activos de 7.80%, reflejo de la alta rotación de inventarios y activos comerciales.'
    },
    {
      title: 'Margen Bruto (%)',
      subtitle: 'Margen s/ Ventas',
      value2025: 33.34,
      value2024: 30.24,
      diffText: '▲ +3,10 p.p. vs 2024',
      isPositive: true,
      unit: '%',
      covenant: '≥ 25.00%',
      statusText: 'Excelente',
      explanation: 'Rentabilidad bruta del 33.34%, expandida en 310 puntos básicos gracias al mix de ventas de repuestos y maquinaria.'
    },
    {
      title: 'Margen Operativo EBIT (%)',
      subtitle: 'EBIT s/ Ventas',
      value2025: 21.82,
      value2024: 17.05,
      diffText: '▲ +4,77 p.p. vs 2024',
      isPositive: true,
      unit: '%',
      covenant: '≥ 15.00%',
      statusText: 'Sobresaliente',
      explanation: 'Margen operativo del 21.82%, con una fuerte expansión de 477 puntos básicos por economías de escala comerciales.'
    },
    {
      title: 'Razón Corriente',
      subtitle: 'Covenant BBV ≥ 1.20x',
      value2025: 3.08,
      value2024: 3.46,
      diffText: '▼ -0,38x vs 2024',
      isPositive: true,
      unit: 'x',
      covenant: '≥ 1.20x',
      statusText: 'Cumple Holgado',
      explanation: 'Solvencia de corto plazo de 3.08x: se cuenta con más de Bs. 3.00 de activo corriente por cada Bs. 1.00 de deuda inmediata.'
    },
    {
      title: 'Deuda / Patrimonio RDP',
      subtitle: 'Covenant BBV ≤ 2.50x',
      value2025: 0.66,
      value2024: 0.55,
      diffText: '▲ +0,11x vs 2024',
      isPositive: true,
      unit: 'x',
      covenant: '≤ 2.50x',
      statusText: 'Bajo Riesgo',
      explanation: 'Apalancamiento muy seguro de solo 0.66x, ampliamente inferior al límite contractual máximo del covenant (≤ 2.50x).'
    },
    {
      title: 'Ciclo Conversión Efectivo',
      subtitle: 'DIO + DSO - DPO',
      value2025: -9.66,
      value2024: -2.64,
      diffText: '▼ -7,02 d vs 2024',
      isPositive: true,
      unit: 'días',
      covenant: '≤ 30 días',
      statusText: 'Óptimo',
      explanation: 'Ciclo de efectivo negativo de -9.66 días: los proveedores internacionales financian totalmente el capital de trabajo operativo.'
    },
    {
      title: 'Cobertura Intereses',
      subtitle: 'EBIT / Gastos Fin.',
      value2025: 8.99,
      value2024: 4.13,
      diffText: '▲ +4,86x vs 2024',
      isPositive: true,
      unit: 'x',
      covenant: '≥ 1.50x',
      statusText: 'Blindaje Total',
      explanation: 'Capacidad de servicio de deuda: el EBIT cubre casi 9 veces la totalidad de los intereses bancarios devengados.'
    }
  ],

  // SISTEMA DUPONT Y COVENANTS BBV (IMAGEN 4)
  dupont: {
    netMargin: {
      title: 'Margen Neto (Motor 1)',
      name: 'Rentabilidad s/ Ventas',
      formula: 'Utilidad Neta / Ingresos Netos',
      year2025: 11.06,
      year2024: 12.94,
      diff: -1.88,
      unit: '%',
      description: 'Porcentaje de los ingresos comerciales que queda como utilidad final tras costos, gastos y diferencia de cambio.',
      categoryLabel: 'Eficacia de Margen Comercial',
      impactOnRoe: 'Impacto en el ROE: -1.88 p.p. debido a la carga cambiaria no operativa.'
    },
    assetTurnover: {
      title: 'Rotación de Activos (Motor 2)',
      name: 'Eficiencia en Activos',
      formula: 'Ingresos Netos / Activos Totales',
      year2025: 0.71,
      year2024: 0.65,
      diff: 0.06,
      unit: 'x',
      description: 'Generación de ingresos comerciales por cada Boliviano invertido en inventarios, infraestructura y activos totales.',
      categoryLabel: 'Rotación Comercial',
      impactOnRoe: 'Impacto dinamizador: +1.10 p.p. gracias a mayor velocidad en ventas de camiones y repuestos.'
    },
    financialLeverage: {
      title: 'Apalancamiento (Motor 3)',
      name: 'Multiplicador de Capital',
      formula: 'Activos Totales / Patrimonio Neto',
      year2025: 1.66,
      year2024: 1.55,
      diff: 0.11,
      unit: 'x',
      description: 'Relación entre los recursos totales de la empresa y los fondos aportados por los accionistas.',
      categoryLabel: 'Estructura Financiera',
      impactOnRoe: 'Impacto en el ROE: +0.90 p.p. por moderado apalancamiento que protegió la rentabilidad patrimonial.'
    },
    roe: {
      title: 'ROE DuPont (resultado)',
      name: 'Rendimiento s/ Patrimonio',
      formula: 'Margen Neto × Rotación × Apalancamiento',
      year2025: 12.97,
      year2024: 12.99,
      diff: -0.02,
      unit: '%',
      description: '11.06% × 0.71x × 1.66x = 12.97% (Gestión 2025). Cumplimiento exacto con el ROE contable directo.',
      categoryLabel: 'Retorno para Accionistas',
      impactOnRoe: 'Validación: ROE DuPont = ROE Directo = 12.97% (✓ COINCIDEN).'
    },
    verificationMatch: true,
    attributionAnalysis: {
      marginImpact: 'Margen Neto: -1.88 p.p. de impacto por diferencia de cambio.',
      turnoverImpact: 'Rotación de Activos: +1.10 p.p. de contribución positiva por crecimiento de ventas.',
      leverageImpact: 'Apalancamiento: +0.90 p.p. de amortiguación positiva mediante financiamiento estructurado.',
      conclusion: 'El ROE se mantuvo equilibrado en 12.97%: la mayor rotación comercial (+0.06x) y el apalancamiento prudente (+0.11x) compensaron la compresión del margen neto causada por las diferencias de cambio transitorias.'
    }
  },

  // TABLERO DE RATIOS (IMAGEN 4)
  ratios: [
    // 1. LIQUIDEZ
    {
      id: 'rc',
      name: 'Razón Corriente (Covenant BBV ≥ 1.20x)',
      category: 'LIQUIDEZ',
      formula: 'Activo Corriente / Pasivo Corriente',
      year2025: 3.08,
      year2024: 3.46,
      diff: -0.38,
      diffText: '-0.38x',
      betterIf: 'Mayor',
      trend: 'Deterioro',
      unit: 'x',
      covenant: '≥ 1.20x',
      covenantMet: true,
      target: 1.20,
      status: 'optimal',
      interpretation: 'Capacidad de pago de corto plazo muy superior a la meta crediticia.',
      explanation: 'Dispone de Bs. 3.08 en activo circulante por cada Bs. 1.00 de deudas exigibles a menos de un año.'
    },
    {
      id: 'pa',
      name: 'Prueba Ácida',
      category: 'LIQUIDEZ',
      formula: '(Activo Corriente - Inventarios) / Pasivo Corriente',
      year2025: 2.07,
      year2024: 1.74,
      diff: 0.33,
      diffText: '+0.33x',
      betterIf: 'Mayor',
      trend: 'Mejora',
      unit: 'x',
      status: 'optimal',
      interpretation: 'Liquidez estricta inmediata sin requerir la venta de existencias.',
      explanation: 'Aumentó a 2.07x gracias al alto saldo en DPFs temporarios (Bs. 538.3M), garantizando solvencia inmediata.'
    },
    {
      id: 'rt',
      name: 'Razón de Tesorería / Efectivo',
      category: 'LIQUIDEZ',
      formula: '(Disponibilidades + Inversiones Temp.) / Pasivo Corriente',
      year2025: 1.56,
      year2024: 0.84,
      diff: 0.72,
      diffText: '+0.72x',
      betterIf: 'Mayor',
      trend: 'Mejora',
      unit: 'x',
      status: 'optimal',
      interpretation: 'Efectivo disponible cubre holgadamente el total de deudas de corto plazo.',
      explanation: 'Casi se duplicó la cobertura de tesorería de 0.84x a 1.56x, proporcionando un colchón de seguridad extraordinario.'
    },

    // 2. GESTIÓN / ACTIVIDAD AUTOMOTRIZ
    {
      id: 'ri',
      name: 'Rotación de Inventarios',
      category: 'GESTIÓN',
      formula: 'Costo de Ventas / Inventario Promedio',
      year2025: 1.78,
      year2024: 1.22,
      diff: 0.56,
      diffText: '+0.56x',
      betterIf: 'Mayor',
      trend: 'Mejora',
      unit: 'x',
      status: 'optimal',
      interpretation: 'Mayor dinamismo en la rotación y despacho de maquinaria y repuestos.',
      explanation: 'El inventario rotó 1.78 veces en 2025 frente a 1.22 veces en 2024, reduciendo capital inmovilizado.'
    },
    {
      id: 'dio',
      name: 'Días de Inventario (DIO)',
      category: 'GESTIÓN',
      formula: '(Inventario / Costo de Ventas) × 365',
      year2025: 205.49,
      year2024: 300.08,
      diff: -94.59,
      diffText: '-94.59 d',
      betterIf: 'Menor',
      trend: 'Mejora',
      unit: 'días',
      status: 'optimal',
      interpretation: 'Disminución drástica de 94.59 días en el tiempo de permanencia del stock.',
      explanation: 'El stock pasó de tardar 300.08 días a solo 205.49 días en convertirse en ventas comerciales efectivas.'
    },
    {
      id: 'dso',
      name: 'Días de Cobro Comercial (DSO)',
      category: 'GESTIÓN',
      formula: '(Cuentas por Cobrar / Ventas) × 365',
      year2025: 31.92,
      year2024: 95.12,
      diff: -63.20,
      diffText: '-63.20 d',
      betterIf: 'Menor',
      trend: 'Mejora',
      unit: 'días',
      status: 'optimal',
      interpretation: 'Cobranza comercial sumamente ágil y eficiente.',
      explanation: 'El periodo de cobro se redujo de 95.12 días a apenas 31.92 días, acelerando sustancialmente el ingreso de fondos.'
    },
    {
      id: 'dpo',
      name: 'Días de Pago a Proveedores (DPO)',
      category: 'GESTIÓN',
      formula: '(Cuentas por Pagar / Costo de Ventas) × 365',
      year2025: 75.81,
      year2024: 26.47,
      diff: 49.34,
      diffText: '+49.34 d',
      betterIf: 'Mayor',
      trend: 'Mejora',
      unit: 'días',
      status: 'optimal',
      interpretation: 'Mejora en las condiciones de crédito comercial otorgadas por proveedores.',
      explanation: 'Los proveedores internacionales otorgan 75.81 días de crédito medio, financiando el ciclo operativo.'
    },
    {
      id: 'cce',
      name: 'Ciclo de Conversión de Efectivo (CCE)',
      category: 'GESTIÓN',
      formula: 'DIO + DSO - DPO',
      year2025: -9.66,
      year2024: -2.64,
      diff: -7.02,
      diffText: '-7.02 d',
      betterIf: 'Menor',
      trend: 'Mejora',
      unit: 'días',
      status: 'optimal',
      interpretation: 'Ciclo de capital de trabajo autofinanciado por proveedores.',
      explanation: 'Ciclo negativo de -9.66 días: la empresa cobra sus ventas antes de tener que pagar a sus proveedores.'
    },
    {
      id: 'rat',
      name: 'Rotación de Activos Totales',
      category: 'GESTIÓN',
      formula: 'Ventas Netas / Activos Totales',
      year2025: 0.71,
      year2024: 0.65,
      diff: 0.06,
      diffText: '+0.06x',
      betterIf: 'Mayor',
      trend: 'Mejora',
      unit: 'x',
      status: 'optimal',
      interpretation: 'Mayor rendimiento en ventas por cada unidad monetaria de activos.',
      explanation: 'Aumentó a 0.71x gracias a la vigorosa expansión en las ventas de camiones y maquinaria agrícola.'
    },

    // 3. SOLVENCIA Y COVENANTS BBV
    {
      id: 'end',
      name: 'Endeudamiento Total',
      category: 'SOLVENCIA',
      formula: 'Total Pasivos / Total Activos',
      year2025: 39.85,
      year2024: 35.59,
      diff: 4.26,
      diffText: '+4.26 p.p.',
      betterIf: 'Menor',
      trend: 'Deterioro',
      unit: '%',
      covenant: '≤ 60.00%',
      covenantMet: true,
      status: 'optimal',
      interpretation: 'Estructura financiera muy conservadora: solo el 39.85% de los activos son financiados con deuda.',
      explanation: 'El endeudamiento creció levemente a 39.85% para financiar la colocación en DPFs, manteniéndose en zona de bajo riesgo.'
    },
    {
      id: 'rdp',
      name: 'Relación Deuda / Patrimonio (Covenant RDP ≤ 2.50x)',
      category: 'SOLVENCIA',
      formula: 'Deuda Financiera Total / Patrimonio Neto',
      year2025: 0.66,
      year2024: 0.55,
      diff: 0.11,
      diffText: '+0.11x',
      betterIf: 'Menor',
      trend: 'Deterioro',
      unit: 'x',
      covenant: '≤ 2.50x',
      covenantMet: true,
      target: 2.50,
      status: 'optimal',
      interpretation: 'Cumplimiento holgado del covenant de deuda de la Bolsa Boliviana de Valores.',
      explanation: 'El ratio RDP se ubica en 0.66x, muy inferior al tope crediticio permitido de 2.50x.'
    },
    {
      id: 'cobertura_int',
      name: 'Cobertura de Intereses (EBIT/GF)',
      category: 'SOLVENCIA',
      formula: 'Utilidad Operativa EBIT / Gastos Financieros',
      year2025: 8.99,
      year2024: 4.13,
      diff: 4.86,
      diffText: '+4.86x',
      betterIf: 'Mayor',
      trend: 'Mejora',
      unit: 'x',
      covenant: '≥ 1.50x',
      covenantMet: true,
      target: 1.50,
      status: 'optimal',
      interpretation: 'Capacidad de pago de intereses bancarios casi 6 veces superior a la exigencia bancaria.',
      explanation: 'El EBIT creció a Bs. 265.25M mientras los gastos financieros se redujeron a Bs. 29.50M, disparando la cobertura a 8.99x.'
    },

    // 4. RENTABILIDAD
    {
      id: 'mb_pct',
      name: 'Margen Bruto (%)',
      category: 'RENTABILIDAD',
      formula: 'Margen Bruto / Ventas Netas',
      year2025: 33.34,
      year2024: 30.24,
      diff: 3.10,
      diffText: '+3.10 p.p.',
      betterIf: 'Mayor',
      trend: 'Mejora',
      unit: '%',
      status: 'optimal',
      interpretation: 'Ganancia bruta del 33.34% tras deducir el costo comercial de ventas.',
      explanation: 'Subió de 30.24% a 33.34% gracias al incremento en volumen de líneas de alta rentabilidad como repuestos.'
    },
    {
      id: 'ebit_pct',
      name: 'Margen Operativo EBIT (%)',
      category: 'RENTABILIDAD',
      formula: 'Utilidad Operativa EBIT / Ventas Netas',
      year2025: 21.82,
      year2024: 17.05,
      diff: 4.77,
      diffText: '+4.77 p.p.',
      betterIf: 'Mayor',
      trend: 'Mejora',
      unit: '%',
      status: 'optimal',
      interpretation: 'Fuerte apalancamiento operativo comercial: 21.82% de margen antes de cargas financieras.',
      explanation: 'La eficiencia en gastos de administración y ventas expandió el margen operativo en 477 puntos básicos.'
    },
    {
      id: 'mn_pct',
      name: 'Margen Neto (%)',
      category: 'RENTABILIDAD',
      formula: 'Utilidad Neta / Ventas Netas',
      year2025: 11.06,
      year2024: 12.94,
      diff: -1.88,
      diffText: '-1.88 p.p.',
      betterIf: 'Mayor',
      trend: 'Deterioro',
      unit: '%',
      status: 'warning',
      interpretation: 'Conversión de ventas en utilidad líquida tras absorber diferencia de cambio.',
      explanation: 'Se redujo de 12.94% a 11.06% por el gasto cambiario extraordinario de Bs. 105.42 millones.'
    },
    {
      id: 'roa_pct',
      name: 'ROA (Retorno sobre Activos)',
      category: 'RENTABILIDAD',
      formula: 'Utilidad Neta / Activos Totales',
      year2025: 7.80,
      year2024: 8.36,
      diff: -0.56,
      diffText: '-0.56 p.p.',
      betterIf: 'Mayor',
      trend: 'Deterioro',
      unit: '%',
      status: 'optimal',
      interpretation: 'Rendimiento sobre la totalidad de recursos invertidos.',
      explanation: 'Ubicado en 7.80%, mostrando un uso altamente rentable de los activos comerciales.'
    },
    {
      id: 'roe_pct',
      name: 'ROE (Retorno sobre Patrimonio)',
      category: 'RENTABILIDAD',
      formula: 'Utilidad Neta / Patrimonio Neto',
      year2025: 12.97,
      year2024: 12.99,
      diff: -0.02,
      diffText: '-0.02 p.p.',
      betterIf: 'Mayor',
      trend: 'Estable',
      unit: '%',
      status: 'optimal',
      interpretation: 'Rentabilidad sostenida para los socios accionistas.',
      explanation: 'Consistente en 12.97% anual, consolidando el valor del capital de los socios.'
    }
  ],

  // VARIACIONES CLAVE 2024 -> 2025 (IMAGEN 5)
  keyVariations: [
    // SITUACIÓN PATRIMONIAL
    {
      category: 'SITUACIÓN PATRIMONIAL',
      concept: 'TOTAL DEL ACTIVO',
      val2024: 1512133717,
      val2025: 1723551307,
      absDiff: 211417590,
      relDiff: 13.98,
      isFavorable: true,
      barMagnitude: 28,
      explanation: 'Crecimiento de Bs. 211.42 millones (+13.98%) impulsado principalmente por el aumento en inversiones temporarias.'
    },
    {
      category: 'SITUACIÓN PATRIMONIAL',
      concept: 'Inversiones temporarias',
      val2024: 137322756,
      val2025: 538341311,
      absDiff: 401018555,
      relDiff: 292.03,
      isFavorable: true,
      barMagnitude: 90,
      explanation: 'Impresionante incremento del 292.03% (+Bs. 401.02M) en depósitos a plazo fijo de tesorería.'
    },
    {
      category: 'SITUACIÓN PATRIMONIAL',
      concept: 'Inventarios',
      val2024: 560634083,
      val2025: 456198524,
      absDiff: -104435559,
      relDiff: -18.62,
      isFavorable: true,
      barMagnitude: 37,
      explanation: 'Optimización de stock en maquinaria y vehículos: reducción de Bs. 104.44 millones acelerando la rotación.'
    },
    {
      category: 'SITUACIÓN PATRIMONIAL',
      concept: 'Cuentas por cobrar comerciales (CP)',
      val2024: 203110173,
      val2025: 94440440,
      absDiff: -108669733,
      relDiff: -53.50,
      isFavorable: true,
      barMagnitude: 60,
      explanation: 'Excelente gestión de crédito y cobranzas: recuperación de cartera en más del 53.50%.'
    },
    {
      category: 'SITUACIÓN PATRIMONIAL',
      concept: 'Cuentas por pagar comerciales',
      val2024: 49440722,
      val2025: 168315655,
      absDiff: 118874933,
      relDiff: 240.45,
      isFavorable: true,
      barMagnitude: 85,
      explanation: 'Ampliación de financiamiento espontáneo de proveedores de marcas representadas (+240.45%).'
    },
    {
      category: 'SITUACIÓN PATRIMONIAL',
      concept: 'TOTAL DEL PATRIMONIO NETO',
      val2024: 974026049,
      val2025: 1036759315,
      absDiff: 62733266,
      relDiff: 6.44,
      isFavorable: true,
      barMagnitude: 20,
      explanation: 'Aumento neto de Bs. 62.73 millones (+6.44%) por capitalización de utilidades líquidas.'
    },

    // ESTADO DE GANANCIAS Y PÉRDIDAS
    {
      category: 'ESTADO DE RESULTADOS',
      concept: 'INGRESOS NETOS',
      val2024: 977165060,
      val2025: 1215703421,
      absDiff: 238538361,
      relDiff: 24.41,
      isFavorable: true,
      barMagnitude: 48,
      explanation: 'Crecimiento de ventas del 24.41% (+Bs. 238.54M), alcanzando récord comercial en camiones y repuestos.'
    },
    {
      category: 'ESTADO DE RESULTADOS',
      concept: 'MARGEN BRUTO',
      val2024: 295508465,
      val2025: 405367591,
      absDiff: 109859126,
      relDiff: 37.17,
      isFavorable: true,
      barMagnitude: 65,
      explanation: 'Aumento de Bs. 109.86 millones (+37.17%) por mayor eficiencia comercial y margen en repuestos.'
    },
    {
      category: 'ESTADO DE RESULTADOS',
      concept: 'UTILIDAD OPERATIVA (EBIT)',
      val2024: 166560061,
      val2025: 265245523,
      absDiff: 98685462,
      relDiff: 59.25,
      isFavorable: true,
      barMagnitude: 80,
      explanation: 'Expansión de la ganancia operativa en un 59.25% (+Bs. 98.69M) por apalancamiento operativo.'
    },
    {
      category: 'ESTADO DE RESULTADOS',
      concept: 'Diferencia de cambio',
      val2024: -19491577,
      val2025: -105418740,
      absDiff: -85927163,
      relDiff: -440.89,
      isFavorable: false,
      barMagnitude: 95,
      explanation: 'Mayor costo por ajuste cambiario de -Bs. 105.42M debido a variaciones en monedas extranjeras de importación.'
    },
    {
      category: 'ESTADO DE RESULTADOS',
      concept: 'UTILIDAD NETA DEL EJERCICIO',
      val2024: 126482232,
      val2025: 134456384,
      absDiff: 7974152,
      relDiff: 6.31,
      isFavorable: true,
      barMagnitude: 18,
      explanation: 'Ganancia neta récord de Bs. 134.46 millones (+6.31%), confirmando la solvencia comercial del negocio.'
    }
  ],

  // ESTRUCTURA DEL ACTIVO (IMAGEN 1 Y HOJA DATOS DASHBOARD)
  assetStructureItems: [
    { name: 'Inversiones temporarias (DPF)', val2025: 538.34, val2024: 137.32, pct2025: 31.23 },
    { name: 'Inventarios', val2025: 456.20, val2024: 560.60, pct2025: 26.47 },
    { name: 'Activos fijos', val2025: 308.13, val2024: 318.70, pct2025: 17.88 },
    { name: 'Disponibilidades', val2025: 164.62, val2024: 168.80, pct2025: 9.55 },
    { name: 'CxC comerciales (CP + LP)', val2025: 106.33, val2024: 253.20, pct2025: 6.17 },
    { name: 'Impuestos y pagos anticipados', val2025: 89.98, val2024: 58.30, pct2025: 5.22 },
    { name: 'CxC relacionadas y otros activos', val2025: 59.95, val2024: 15.21, pct2025: 3.48 }
  ],

  // ESTRUCTURA DE FINANCIAMIENTO (IMAGEN 1 - DOUGHNUT)
  financingStructure: [
    { concept: 'Patrimonio Neto', amount: 1036.76, percentage: 60.15, color: '#1e3a8a', explanation: 'Capital propio y reservas: 60.15% del financiamiento total.' },
    { concept: 'Deuda Financiera LP', amount: 224.14, percentage: 13.00, color: '#0284c7', explanation: 'Créditos bancarios de largo plazo y bonos bursátiles.' },
    { concept: 'Deuda Financiera CP', amount: 198.34, percentage: 11.51, color: '#10b981', explanation: 'Líneas de crédito bancario comercial de corto plazo.' },
    { concept: 'Cuentas por Pagar Com.', amount: 168.32, percentage: 9.77, color: '#f59e0b', explanation: 'Crédito espontáneo comercial de proveedores del exterior.' },
    { concept: 'Deudas Fiscales y Otros Pas.', amount: 96.00, percentage: 5.57, color: '#8b5cf6', explanation: 'Obligaciones tributarias, laborales y provisiones operativas.' }
  ],

  // DISTRIBUCIÓN DE CADA BS. DE INGRESO (IMAGEN 2)
  incomeDistributionItems: [
    { concept: 'Costo de Ventas (Mercaderías)', amount: 810.34, percentage: 66.66, color: '#475569', explanation: 'Costo directo de adquisición de camiones, maquinaria y repuestos.' },
    { concept: 'Gastos de Administración y Comercialización', amount: 140.12, percentage: 11.53, color: '#0284c7', explanation: 'Operación de concesionarios, sucursales y fuerza de ventas.' },
    { concept: 'Diferencia de Cambio (Ajuste)', amount: 105.42, percentage: 8.67, color: '#ef4444', explanation: 'Carga cambiaria por importaciones de inventario extranjero.' },
    { concept: 'Gastos Financieros', amount: 29.50, percentage: 2.43, color: '#f59e0b', explanation: 'Intereses bancarios por préstamos y cupones de bonos corporativos.' },
    { concept: 'Impuestos (IUE)', amount: 41.56, percentage: 3.42, color: '#8b5cf6', explanation: 'Impuesto a las utilidades empresariales correspondiente a 2025.' },
    { concept: 'Utilidad Neta Final', amount: 134.46, percentage: 11.06, color: '#10b981', explanation: 'Rendimiento líquido final para los accionistas (11.06% de las ventas).' }
  ],

  // CICLO DE CAPITAL DE TRABAJO (IMAGEN 3)
  workingCapitalCycle: [
    { id: 'dio', name: 'Días de Inventario', shortName: 'DIO', val2025: 205.49, val2024: 300.08, diff: -94.59, unit: 'días', explanation: 'Reducción de 94.59 días en el tiempo medio de permanencia del stock de repuestos y unidades.' },
    { id: 'dso', name: 'Días de Cobro', shortName: 'DSO', val2025: 31.92, val2024: 95.12, diff: -63.20, unit: 'días', explanation: 'Recuperación de cuentas por cobrar en solo 31.92 días (vs 95.12 días en 2024).' },
    { id: 'dpo', name: 'Días Pago a Proveedores', shortName: 'DPO', val2025: 75.81, val2024: 26.47, diff: 49.34, unit: 'días', explanation: 'Financiamiento comercial ampliado a 75.81 días otorgado por las fábricas proveedoras.' },
    { id: 'cce', name: 'Ciclo Conversión Efectivo', shortName: 'CCE', val2025: -9.66, val2024: -2.64, diff: -7.02, unit: 'días', explanation: 'Ciclo negativo de -9.66 días: los proveedores financian íntegramente las operaciones.' }
  ],

  // VENTAS POR LÍNEA DE NEGOCIO (IMAGEN 3 - NOTA 15)
  businessLines: [
    { name: 'Camiones', val2025: 414.62, val2024: 352.60, diff: 62.02, pctOfTotal2025: 34.11 },
    { name: 'Repuestos y materiales', val2025: 289.24, val2024: 226.00, diff: 63.24, pctOfTotal2025: 23.79 },
    { name: 'Maq. agrícola John Deere', val2025: 200.05, val2024: 100.10, diff: 99.95, pctOfTotal2025: 16.46 },
    { name: 'Vehículos livianos', val2025: 137.82, val2024: 159.90, diff: -22.08, pctOfTotal2025: 11.34 },
    { name: 'Maquinaria pesada', val2025: 116.41, val2024: 85.00, diff: 31.41, pctOfTotal2025: 9.58 },
    { name: 'Servicios de taller', val2025: 52.03, val2024: 43.80, diff: 8.23, pctOfTotal2025: 4.28 },
    { name: 'Vehículos usados', val2025: 4.53, val2024: 8.80, diff: -4.27, pctOfTotal2025: 0.37 }
  ],

  // COVENANTS BONOS BBV (IMAGEN 4 - NOTA 12)
  covenantsBBV: [
    { commitment: 'Razón Corriente (RC ≥ 1.20x)', value2025: '3,08x', limit: '≥ 1,20x', isMet: true, rule: 'Activo Corriente / Pasivo Corriente' },
    { commitment: 'Relación Endeudamiento (RDP ≤ 2.50x)', value2025: '0,66x', limit: '≤ 2,50x', isMet: true, rule: 'Deuda Financiera Total / Patrimonio Neto' },
    { commitment: 'Cobertura Servicio Deuda Fin. (≥ 1.50x)', value2025: '8,99x', limit: '≥ 1,50x', isMet: true, rule: 'Utilidad Operativa EBIT / Gastos Financieros' }
  ],

  // TABLAS DETALLADAS PARA PESTAÑAS
  balanceSheetRows: [
    { concept: 'Inversiones temporarias (DPF)', year2024: 137.32, year2025: 538.34, absDiff: 401.02, relDiff: 292.03, category: 'ACTIVO CORRIENTE' },
    { concept: 'Inventarios comerciales (repuestos, unidades)', year2024: 560.60, year2025: 456.20, absDiff: -104.40, relDiff: -18.62, category: 'ACTIVO CORRIENTE' },
    { concept: 'Disponibilidades (Caja y Bancos)', year2024: 168.80, year2025: 164.62, absDiff: -4.18, relDiff: -2.48, category: 'ACTIVO CORRIENTE' },
    { concept: 'Cuentas por cobrar comerciales (CP)', year2024: 203.11, year2025: 94.44, absDiff: -108.67, relDiff: -53.50, category: 'ACTIVO CORRIENTE' },
    { concept: 'Impuestos y pagos anticipados', year2024: 58.30, year2025: 89.98, absDiff: 31.68, relDiff: 54.34, category: 'ACTIVO CORRIENTE' },
    { concept: 'TOTAL ACTIVO CORRIENTE', year2024: 1130.27, year2025: 1395.27, absDiff: 265.00, relDiff: 23.45, isSubtotal: true, category: 'ACTIVO CORRIENTE' },
    { concept: 'Activos fijos (Bienes de uso netos)', year2024: 318.70, year2025: 308.13, absDiff: -10.57, relDiff: -3.32, category: 'ACTIVO NO CORRIENTE' },
    { concept: 'CxC relacionadas y otros activos (LP)', year2024: 63.16, year2025: 20.15, absDiff: -43.01, relDiff: -68.10, category: 'ACTIVO NO CORRIENTE' },
    { concept: 'TOTAL ACTIVO NO CORRIENTE', year2024: 381.86, year2025: 328.28, absDiff: -53.58, relDiff: -14.03, isSubtotal: true, category: 'ACTIVO NO CORRIENTE' },
    { concept: 'TOTAL DEL ACTIVO', year2024: 1512.13, year2025: 1723.55, absDiff: 211.42, relDiff: 13.98, isTotal: true, category: 'BALANCE GENERAL' },
    { concept: 'Deuda Financiera CP', year2024: 168.00, year2025: 198.34, absDiff: 30.34, relDiff: 18.06, category: 'PASIVO CORRIENTE' },
    { concept: 'Cuentas por pagar comerciales (Proveedores)', year2024: 49.44, year2025: 168.32, absDiff: 118.88, relDiff: 240.45, category: 'PASIVO CORRIENTE' },
    { concept: 'Deudas fiscales, laborales y otros pasivos', year2024: 109.30, year2025: 86.15, absDiff: -23.15, relDiff: -21.18, category: 'PASIVO CORRIENTE' },
    { concept: 'TOTAL PASIVO CORRIENTE', year2024: 326.74, year2025: 452.81, absDiff: 126.07, relDiff: 38.58, isSubtotal: true, category: 'PASIVO CORRIENTE' },
    { concept: 'Deuda Financiera LP (Bancaria y Bonos)', year2024: 209.30, year2025: 224.14, absDiff: 14.84, relDiff: 7.09, category: 'PASIVO NO CORRIENTE' },
    { concept: 'Previsiones y otros pasivos no corrientes', year2024: 2.07, year2025: 9.84, absDiff: 7.77, relDiff: 375.36, category: 'PASIVO NO CORRIENTE' },
    { concept: 'TOTAL PASIVO NO CORRIENTE', year2024: 211.37, year2025: 233.98, absDiff: 22.61, relDiff: 10.70, isSubtotal: true, category: 'PASIVO NO CORRIENTE' },
    { concept: 'TOTAL PASIVO', year2024: 538.11, year2025: 686.79, absDiff: 148.68, relDiff: 27.63, isSubtotal: true, category: 'BALANCE GENERAL' },
    { concept: 'TOTAL DEL PATRIMONIO NETO', year2024: 974.03, year2025: 1036.76, absDiff: 62.73, relDiff: 6.44, isTotal: true, category: 'BALANCE GENERAL' }
  ],

  incomeStatementRows: [
    { concept: 'Ingresos netos por ventas', year2024: 977.17, year2025: 1215.70, absDiff: 238.53, relDiff: 24.41, isHeader: true, category: 'ESTADO DE RESULTADOS' },
    { concept: 'Costo de productos y mercaderías vendidas', year2024: -681.66, year2025: -810.34, absDiff: -128.68, relDiff: 18.88, category: 'ESTADO DE RESULTADOS' },
    { concept: 'MARGEN BRUTO', year2024: 295.51, year2025: 405.37, absDiff: 109.86, relDiff: 37.17, isSubtotal: true, category: 'ESTADO DE RESULTADOS' },
    { concept: 'Gastos de administración y comercialización', year2024: -128.95, year2025: -140.12, absDiff: -11.17, relDiff: 8.66, category: 'ESTADO DE RESULTADOS' },
    { concept: 'UTILIDAD OPERATIVA (EBIT)', year2024: 166.56, year2025: 265.25, absDiff: 98.69, relDiff: 59.25, isSubtotal: true, category: 'ESTADO DE RESULTADOS' },
    { concept: 'Diferencia de cambio (Ajuste cambiario)', year2024: -19.49, year2025: -105.42, absDiff: -85.93, relDiff: 440.89, category: 'ESTADO DE RESULTADOS' },
    { concept: 'Gastos financieros netos', year2024: -40.32, year2025: -29.50, absDiff: 10.82, relDiff: -26.84, category: 'ESTADO DE RESULTADOS' },
    { concept: 'UTILIDAD ANTES DE IMPUESTOS (EBT)', year2024: 183.89, year2025: 203.78, absDiff: 19.89, relDiff: 10.82, isSubtotal: true, category: 'ESTADO DE RESULTADOS' },
    { concept: 'Impuesto sobre las utilidades (IUE)', year2024: -36.78, year2025: -41.56, absDiff: -4.78, relDiff: 13.00, category: 'ESTADO DE RESULTADOS' },
    { concept: 'UTILIDAD NETA DEL EJERCICIO', year2024: 126.48, year2025: 134.46, absDiff: 7.98, relDiff: 6.31, isTotal: true, category: 'ESTADO DE RESULTADOS' }
  ],

  verticalAnalysisRows: [
    { concept: 'Inversiones temporarias (DPF)', year2025: 538.34, year2024: 137.32, pct2025: 31.23, pct2024: 9.08, category: 'ESTRUCTURA DEL ACTIVO' },
    { concept: 'Inventarios', year2025: 456.20, year2024: 560.60, pct2025: 26.47, pct2024: 37.08, category: 'ESTRUCTURA DEL ACTIVO' },
    { concept: 'Activos fijos netos', year2025: 308.13, year2024: 318.70, pct2025: 17.88, pct2024: 21.08, category: 'ESTRUCTURA DEL ACTIVO' },
    { concept: 'Disponibilidades', year2025: 164.62, year2024: 168.80, pct2025: 9.55, pct2024: 11.16, category: 'ESTRUCTURA DEL ACTIVO' },
    { concept: 'CxC comerciales', year2025: 106.33, year2024: 253.20, pct2025: 6.17, pct2024: 16.74, category: 'ESTRUCTURA DEL ACTIVO' },
    { concept: 'TOTAL ACTIVO', year2025: 1723.55, year2024: 1512.13, pct2025: 100.00, pct2024: 100.00, isTotal: true, category: 'ESTRUCTURA DEL ACTIVO' },
    { concept: 'TOTAL PASIVO', year2025: 686.79, year2024: 538.11, pct2025: 39.85, pct2024: 35.59, category: 'ESTRUCTURA DE FINANCIAMIENTO' },
    { concept: 'TOTAL PATRIMONIO NETO', year2025: 1036.76, year2024: 974.03, pct2025: 60.15, pct2024: 64.41, category: 'ESTRUCTURA DE FINANCIAMIENTO' }
  ],

  horizontalAnalysisRows: [
    { concept: 'TOTAL DEL ACTIVO', year2024: 1512133717, year2025: 1723551307, absDiff: 211417590, relDiff: 13.98, isTotal: true, category: 'BALANCE GENERAL' },
    { concept: 'Inversiones temporarias', year2024: 137322756, year2025: 538341311, absDiff: 401018555, relDiff: 292.03, category: 'BALANCE GENERAL' },
    { concept: 'Inventarios', year2024: 560634083, year2025: 456198524, absDiff: -104435559, relDiff: -18.62, category: 'BALANCE GENERAL' },
    { concept: 'Cuentas por cobrar comerciales (CP)', year2024: 203110173, year2025: 94440440, absDiff: -108669733, relDiff: -53.50, category: 'BALANCE GENERAL' },
    { concept: 'Cuentas por pagar comerciales', year2024: 49440722, year2025: 168315655, absDiff: 118874933, relDiff: 240.45, category: 'BALANCE GENERAL' },
    { concept: 'TOTAL DEL PATRIMONIO NETO', year2024: 974026049, year2025: 1036759315, absDiff: 62733266, relDiff: 6.44, isTotal: true, category: 'BALANCE GENERAL' },
    { concept: 'INGRESOS NETOS', year2024: 977165060, year2025: 1215703421, absDiff: 238538361, relDiff: 24.41, isTotal: true, category: 'ESTADO DE RESULTADOS' },
    { concept: 'MARGEN BRUTO', year2024: 295508465, year2025: 405367591, absDiff: 109859126, relDiff: 37.17, category: 'ESTADO DE RESULTADOS' },
    { concept: 'UTILIDAD OPERATIVA (EBIT)', year2024: 166560061, year2025: 265245523, absDiff: 98685462, relDiff: 59.25, category: 'ESTADO DE RESULTADOS' },
    { concept: 'Diferencia de cambio', year2024: -19491577, year2025: -105418740, absDiff: -85927163, relDiff: -440.89, category: 'ESTADO DE RESULTADOS' },
    { concept: 'UTILIDAD NETA DEL EJERCICIO', year2024: 126482232, year2025: 134456384, absDiff: 7974152, relDiff: 6.31, isTotal: true, category: 'ESTADO DE RESULTADOS' }
  ]
};

// Aliases for compatibility
export const EXECUTIVE_FINANCIAL_DATA = COMMERCIAL_INITIAL_DATA;
export const NIBOL_INITIAL_DATA = COMMERCIAL_INITIAL_DATA;
