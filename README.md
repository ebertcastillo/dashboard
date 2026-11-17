# Dashboard Financiero Interactivo & Sistema DuPont (Angular 17+)

Tablero de Control Financiero corporativo para análisis de Estados Financieros, extracción 100% en el navegador (sin backend) mediante archivos Excel (.xlsx), visualización de KPIs con covenants bancarios, descomposición del Sistema DuPont y gráficos corporativos (azul marino, celeste, esmeralda y gris claro).

---

## 🚀 Características Principales

1. **Lectura y Procesamiento Local en Navegador (Zero-Backend)**:
   - Utiliza la librería **SheetJS (`xlsx`)** dentro del servicio `FinancialDataService`.
   - Lee el `ArrayBuffer` del archivo `.xlsx` cargado por el usuario, analiza dinámicamente las hojas y extrae celdas y filas específicas.
   - Viene precargado con los datos financieros reales de **NIBOL LTDA.** (Gestión 2025 vs 2024).
   - Incluye un generador y descargador de plantilla Excel (`.xlsx`) integrado directamente en la UI para pruebas rápidas.

2. **Estructura de las 4 Hojas de Trabajo Soportadas**:
   - **`ESTADOS FINANCIEROS` / `Estados_Financiero`**: Balance General (Activo Corriente/No Corriente, Pasivo y Patrimonio) y Estado de Resultados (Ingresos Netos, Costos, Margen Bruto, Gastos Operativos, EBIT, Gastos Financieros y Utilidad Neta).
   - **`ANÁLISIS VERTICAL`**: Estructura porcentual sobre Activo Total y Pasivo + Patrimonio.
   - **`ANÁLISIS HORIZONTAL`**: Variaciones absolutas (Bs.) y relativas (%) de la Gestión 2025 vs Gestión 2024.
   - **`RATIOS Y DUPONT`**: Parámetros base, ratios clasificados por categoría (Liquidez, Gestión, Solvencia, Rentabilidad) y descomposición matemática del ROE.

3. **Métricas Clave (KPIs) y Covenants Bancarios**:
   - **ROE (Retorno sobre Patrimonio)**: 12.97% (2025) vs 12.99% (2024) | Covenant: ≥ 12.00% (Cumplido).
   - **ROA (Retorno sobre Activos)**: 7.80% (2025) vs 8.36% (2024) | Covenant: ≥ 6.50% (Cumplido).
   - **Margen Neto**: 11.06% (2025) vs 12.94% (2024) | Covenant: ≥ 10.00% (Cumplido).
   - **Razón Corriente**: 3.08x (2025) vs 3.46x (2024) | Covenant: ≥ 1.50x (Cumplido).

4. **Gráficos Corporativos (Chart.js)**:
   - **Gráfico de Torta / Doughnut 1**: Composición del Activo (Activo Corriente: 80.95% vs Activo No Corriente: 19.05%).
   - **Gráfico de Torta / Doughnut 2**: Composición del Pasivo y Patrimonio (Pasivo Corriente: 26.27%, Pasivo No Corriente: 13.58%, Patrimonio Neto: 60.15%).
   - **Gráfico Comparativo de Barras**: Evolución de Ingresos Netos, Costo de Ventas, Margen Bruto, EBIT y Utilidad Neta (2025 vs 2024).

5. **Desglose Interactivo del Sistema DuPont**:
   - Visualización de la ecuación fundamental:
     $$\text{Margen Neto (11.06\%)} \times \text{Rotación de Activos (0.71x)} \times \text{Apalancamiento (1.66x)} = \text{ROE (12.97\%)}$$
   - Permite alternar interactivamente entre la **Gestión 2025** y **Gestión 2024** para evaluar qué inductor generó el rendimiento.

6. **Tablas Analíticas por Pestaña**:
   - **Ratios & Covenants**: Resumen de indicadores de Liquidez, Solvencia, Actividad y Rentabilidad.
   - **Análisis Vertical**: Estructura de activos y pasivos con barras de porcentaje.
   - **Análisis Horizontal**: Variaciones absolutas y relativas con indicadores de tendencia (Crecimiento / Contracción).
   - **Estados Financieros**: Balance General y Estado de Resultados formal.

---

## 🛠️ Stack Tecnológico

- **Framework**: Angular 21 (Standalone Components & Signals)
- **Estilos**: Tailwind CSS v4 (Paleta bancaria corporativa)
- **Librería de Excel**: `xlsx` (SheetJS)
- **Librería de Gráficos**: `chart.js`
- **Pruebas Unitarias**: `@angular/build:unit-test` con Vitest

---

## 💻 Instrucciones de Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor de desarrollo
```bash
npm start
# o alternativamente:
npx ng serve --port 4200
```
Navega en tu navegador a: **`http://localhost:4200`**

### 3. Ejecutar pruebas unitarias
```bash
npx ng test --no-watch
```

### 4. Compilar para producción
```bash
npm run build
```

---

## 📂 Estructura del Código Fuente

```
src/app/
├── models/
│   └── financial.model.ts              # Tipos e interfaces de datos financieros, ratios y DuPont
├── services/
│   ├── financial-data.service.ts       # Servicio reactivo con Signals y parser SheetJS
│   ├── financial-data.service.spec.ts  # Pruebas unitarias completas de parsing y cálculos
│   └── mock-data.ts                    # Datos de referencia NIBOL LTDA.
├── components/
│   ├── file-upload/                    # Zona Drag-and-Drop y carga local de archivos .xlsx
│   ├── kpi-card/                       # Tarjetas de KPIs con covenants y semáforos
│   ├── dupont-card/                    # Desglose interactivo del Sistema DuPont (ROE)
│   ├── charts/
│   │   ├── pie-chart.component.ts      # Gráficos de torta/dona (Activos y Pasivo/Patrimonio)
│   │   └── bar-chart.component.ts      # Gráfico de barras comparativo (2025 vs 2024)
│   ├── financial-tables/               # Explorador de tablas por hojas de cálculo
│   ├── navbar/                         # Barra superior institucional
│   └── financial-dashboard/            # Tablero principal de control financiero
├── app.ts                              # Componente raíz Standalone
└── app.html                            # Layout principal
```
