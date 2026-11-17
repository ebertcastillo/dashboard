export interface FinancialRow {
  concept: string;
  year2025: number;
  year2024: number;
  absDiff?: number;
  relDiff?: number;
  pct2025?: number;
  pct2024?: number;
  category?: string;
  isTotal?: boolean;
  isSubtotal?: boolean;
  isHeader?: boolean;
  level?: number;
  isFavorable?: boolean;
  explanation?: string;
}

export type RatioCategory = 'LIQUIDEZ' | 'GESTIÓN' | 'SOLVENCIA' | 'RENTABILIDAD';

export interface FinancialRatio {
  id: string;
  name: string;
  category: RatioCategory;
  formula: string;
  year2025: number;
  year2024: number;
  diff: number;
  diffText: string;
  betterIf: 'Mayor' | 'Menor';
  trend: 'Mejora' | 'Deterioro' | 'Estable';
  unit: '%' | 'x' | 'días' | 'veces' | 'Bs.';
  covenant?: string;
  covenantMet?: boolean;
  target?: number;
  status: 'optimal' | 'warning' | 'critical';
  interpretation: string;
  explanation: string;
}

export interface DuPontComponent {
  title: string;
  name: string;
  formula: string;
  year2025: number;
  year2024: number;
  diff: number;
  unit: string;
  description: string;
  categoryLabel: string;
  impactOnRoe: string;
}

export interface DuPontData {
  netMargin: DuPontComponent;
  assetTurnover: DuPontComponent;
  financialLeverage: DuPontComponent;
  roe: DuPontComponent;
  verificationMatch: boolean;
  attributionAnalysis: {
    marginImpact: string;
    turnoverImpact: string;
    leverageImpact: string;
    conclusion: string;
  };
}

export interface KpiMetric {
  id: string;
  title: string;
  subtitle?: string;
  value2025: number;
  value2024: number;
  diffText: string;
  isPositive: boolean;
  unit: string;
  covenant?: string;
  covenantMet?: boolean;
  target?: number;
  statusText?: string;
  badgeColor?: 'emerald' | 'cyan' | 'blue' | 'amber' | 'rose';
  interpretation?: string;
  explanation: string;
}

export interface KpiCardData {
  title: string;
  subtitle?: string;
  value2025: number;
  value2024: number;
  diffText: string;
  isPositive: boolean;
  unit: string;
  isCurrency?: boolean;
  covenant?: string;
  statusText?: string;
  explanation: string;
}

export interface BalanceBreakdown {
  currentAssets2025: number;
  currentAssets2024: number;
  pctCurrentAssets2025: number;
  pctCurrentAssets2024: number;

  nonCurrentAssets2025: number;
  nonCurrentAssets2024: number;
  pctNonCurrentAssets2025: number;
  pctNonCurrentAssets2024: number;

  totalAssets2025: number;
  totalAssets2024: number;

  currentLiabilities2025: number;
  currentLiabilities2024: number;
  pctCurrentLiabilities2025: number;
  pctCurrentLiabilities2024: number;

  nonCurrentLiabilities2025: number;
  nonCurrentLiabilities2024: number;
  pctNonCurrentLiabilities2025: number;
  pctNonCurrentLiabilities2024: number;

  totalLiabilities2025: number;
  totalLiabilities2024: number;
  pctTotalLiabilities2025: number;
  pctTotalLiabilities2024: number;

  equity2025: number;
  equity2024: number;
  pctEquity2025: number;
  pctEquity2024: number;
}

export interface IncomeBreakdown {
  netRevenue2025: number;
  netRevenue2024: number;
  costOfSales2025: number;
  costOfSales2024: number;
  grossProfit2025: number;
  grossProfit2024: number;
  operatingExpenses2025: number;
  operatingExpenses2024: number;
  operatingProfit2025: number; // EBIT
  operatingProfit2024: number;
  financialExpenses2025: number;
  financialExpenses2024: number;
  profitBeforeTax2025: number;
  profitBeforeTax2024: number;
  taxes2025: number;
  taxes2024: number;
  netProfit2025: number;
  netProfit2024: number;
}

export interface HorizontalKeyVariation {
  category: 'SITUACIÓN PATRIMONIAL' | 'ESTADO DE RESULTADOS';
  concept: string;
  val2024: number;
  val2025: number;
  absDiff: number;
  relDiff: number;
  isFavorable: boolean;
  barMagnitude: number; // For visual bar width percentage
  explanation: string;
}

export interface WorkingCapitalCycleItem {
  id: string;
  name: string;
  shortName: string;
  val2025: number;
  val2024: number;
  diff: number;
  unit: string;
  explanation: string;
}

export interface BusinessLineItem {
  name: string;
  val2025: number;
  val2024: number;
  diff: number;
  pctOfTotal2025: number;
}

export interface FinancingStructureItem {
  concept: string;
  amount: number;
  percentage: number;
  color: string;
  explanation: string;
}

export interface CovenantBBV {
  commitment: string;
  value2025: string;
  limit: string;
  isMet: boolean;
  rule: string;
}

export interface FinancialReport {
  companyName: string;
  period: string;
  currency: string;
  auditInfo: string;
  fileName?: string;
  uploadDate: Date;
  balanceBreakdown: BalanceBreakdown;
  incomeBreakdown: IncomeBreakdown;
  
  // Top 4 critical KPI covenants (ROE, ROA, Margen Neto, Razón Corriente)
  kpis: KpiMetric[];

  // Executive ribbons
  balanceIncomeKpis: KpiCardData[];
  ratioKpis: KpiCardData[];

  dupont: DuPontData;
  ratios: FinancialRatio[];
  keyVariations: HorizontalKeyVariation[];

  balanceSheetRows: FinancialRow[];
  incomeStatementRows: FinancialRow[];
  verticalAnalysisRows: FinancialRow[];
  horizontalAnalysisRows: FinancialRow[];

  assetStructureItems: {
    name: string;
    val2025: number;
    val2024: number;
    pct2025: number;
  }[];

  incomeDistributionItems: {
    concept: string;
    amount: number;
    percentage: number;
    color: string;
    explanation: string;
  }[];

  // Specific commercial company modules
  workingCapitalCycle?: WorkingCapitalCycleItem[];
  businessLines?: BusinessLineItem[];
  financingStructure?: FinancingStructureItem[];
  covenantsBBV?: CovenantBBV[];
}
