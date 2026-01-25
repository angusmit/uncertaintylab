/**
 * Uncertainty Lab API Client - Types and HTTP functions
 */

// ============= Types =============

export interface Quote {
  strike: number;
  expiry: number;
  option_type: 'call' | 'put';
  bid: number;
  ask: number;
  mid: number;
  iv?: number | null;
}

export interface ChainResponse {
  success: boolean;
  n_quotes: number;
  quotes: Quote[];
  spot: number;
  rate: number;
  div_yield: number;
}

export interface SyntheticChainRequest {
  spot?: number;
  rate?: number;
  div_yield?: number;
  base_vol?: number;
  skew?: number;
  smile?: number;
  term_slope?: number;
  n_strikes?: number;
  n_expiries?: number;
}

export interface CSVColumnMapping {
  strike_col: string;
  option_type_col?: string | null;
  price_source: 'bid_ask_mid' | 'last' | 'mark' | 'close' | 'mid';
  bid_col?: string | null;
  ask_col?: string | null;
  last_col?: string | null;
  mark_col?: string | null;
  close_col?: string | null;
  mid_col?: string | null;
  volume_col?: string | null;
  oi_col?: string | null;
  expiry_col?: string | null;
  strike_has_suffix: boolean;
}

export interface SyntheticSpreadConfig {
  enabled: boolean;
  spread_pct: number;
}

export interface CSVImportRequest {
  csv_data: string;
  mapping: CSVColumnMapping;
  spot: number;
  rate: number;
  div_yield: number;
  expiry_date?: string | null;
  expiry_T?: number | null;
  check_bounds?: boolean;
  synthetic_spread?: SyntheticSpreadConfig | null;
}

export interface ImportDiagnostics {
  'Total Rows': number;
  'Valid Options': number;
  'Dropped (Invalid Strike)': number;
  'Dropped (Invalid Type)': number;
  'Dropped (Invalid Price)': number;
  'Dropped (Bounds Check)': number;
  'Dropped (Zero Price)': number;
  'Using Real Bid/Ask': number;
  'Using Last Price': number;
  'Synthetic Spread': number;
  'Min Price': string;
  'Max Price': string;
  'Mean Price': string;
  'Total Volume': number;
  'Total Open Interest': number;
  'Expiry Source': string;
  'Price Source': string;
}

export interface CSVDetectResponse {
  columns: string[];
  n_rows: number;
  candidates: Record<string, string[]>;
  strike_has_suffix: boolean;
  preview: Record<string, unknown>[];
}

export interface CSVImportResponse {
  success: boolean;
  n_quotes: number;
  diagnostics: ImportDiagnostics;
  warnings: string[];
}

// Multi-CSV Import Types
export interface MultiCSVFileDetect {
  filename: string;
  n_rows: number;
  columns: string[];
  candidates: Record<string, string[]>;
  has_expiry_column: boolean;
  inferred_expiry: string | null;
  strike_has_suffix: boolean;
  error?: string;
}

export interface MultiCSVDetectResponse {
  files: MultiCSVFileDetect[];
  common_columns: string[];
  schema_valid: boolean;
  schema_warnings: string[];
}

export interface MultiCSVFileInput {
  csv_data: string;
  filename: string;
  expiry_date?: string | null;
  expiry_T?: number | null;
}

export interface MultiCSVImportRequest {
  files: MultiCSVFileInput[];
  mapping: CSVColumnMapping;
  spot: number;
  rate: number;
  div_yield: number;
  check_bounds?: boolean;
  synthetic_spread?: SyntheticSpreadConfig | null;
}

export interface PerExpiryDiagnostics {
  expiry: string;
  T: number;
  n_quotes: number;
  n_valid: number;
  pct_valid: number;
  atm_strike: number | null;
  mean_iv: number | null;
  source_file: string;
}

export interface MultiCSVImportResponse {
  success: boolean;
  n_quotes: number;
  n_expiries: number;
  per_expiry: PerExpiryDiagnostics[];
  overall_diagnostics: Record<string, number | string>;
  warnings: string[];
}

export interface ComputeIVRequest {
  iv_min?: number;
  iv_max?: number;
}

export interface ComputeIVResponse {
  success: boolean;
  n_valid: number;
  n_failed: number;
  quotes: Quote[];
}

export interface FitSurfaceRequest {
  h_x?: number;
  h_y?: number;
  option_type?: 'call' | 'put';
}

export interface FitSurfaceResponse {
  success: boolean;
  n_points: number;
  rmse: number;
  bounds: { x: [number, number]; y: [number, number] };
}

export interface SurfaceGridRequest {
  nx?: number;
  ny?: number;
  option_type?: 'call' | 'put';
}

export interface SurfaceGridResponse {
  x: number[];
  y: number[];
  z: number[][];
  x_label: string;
  y_label: string;
  z_label: string;
}

export interface EuropeanPriceRequest {
  spot: number;
  strike: number;
  expiry: number;
  rate: number;
  div_yield: number;
  vol: number;
  option_type: 'call' | 'put';
}

export interface EuropeanPriceResponse {
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface MCConvergenceRequest {
  spot: number;
  strike: number;
  expiry: number;
  rate: number;
  div_yield: number;
  vol: number;
  option_type: 'call' | 'put';
  max_paths?: number;
}

export interface MCConvergenceResponse {
  path_counts: number[];
  prices: number[];
  std_errors: number[];
  bs_price: number;
}

export interface DiagnosticsResponse {
  chain_loaded: boolean;
  n_quotes: number;
  iv_computed: boolean;
  n_valid_iv: number;
  surface_fitted: boolean;
  surface_rmse: number | null;
  surface_bounds: { x: [number, number]; y: [number, number] } | null;
}

// ============= API Client =============

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Chain operations
  chain: {
    createSynthetic: (params: SyntheticChainRequest = {}): Promise<ChainResponse> =>
      apiFetch('/chain/synthetic', { method: 'POST', body: JSON.stringify(params) }),
    get: (): Promise<ChainResponse> => apiFetch('/chain'),
    reset: (): Promise<{ success: boolean }> => apiFetch('/reset', { method: 'POST' }),
  },

  // CSV operations
  csv: {
    detect: async (file: File): Promise<CSVDetectResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_BASE}/import/csv/detect`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to detect CSV columns');
      return response.json();
    },
    import: (params: CSVImportRequest): Promise<CSVImportResponse> =>
      apiFetch('/import/csv', { method: 'POST', body: JSON.stringify(params) }),
  },

  // Multi-CSV operations
  multiCsv: {
    detect: async (files: File[]): Promise<MultiCSVDetectResponse> => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      const response = await fetch(`${API_BASE}/import/csv/multi/detect`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to detect CSV files' }));
        throw new Error(error.detail || 'Failed to detect CSV files');
      }
      return response.json();
    },
    import: (params: MultiCSVImportRequest): Promise<MultiCSVImportResponse> =>
      apiFetch('/import/csv/multi', { method: 'POST', body: JSON.stringify(params) }),
  },

  // IV operations
  iv: {
    compute: (params: ComputeIVRequest = {}): Promise<ComputeIVResponse> =>
      apiFetch('/iv/compute', { method: 'POST', body: JSON.stringify(params) }),
  },

  // Surface operations
  surface: {
    fit: (params: FitSurfaceRequest = {}): Promise<FitSurfaceResponse> =>
      apiFetch('/surface/fit', { method: 'POST', body: JSON.stringify(params) }),
    grid: (params: SurfaceGridRequest = {}): Promise<SurfaceGridResponse> =>
      apiFetch('/surface/grid', { method: 'POST', body: JSON.stringify(params) }),
  },

  // Pricing operations
  pricing: {
    european: (params: EuropeanPriceRequest): Promise<EuropeanPriceResponse> =>
      apiFetch('/price/european', { method: 'POST', body: JSON.stringify(params) }),
    mcConvergence: (params: MCConvergenceRequest): Promise<MCConvergenceResponse> =>
      apiFetch('/price/mc/convergence', { method: 'POST', body: JSON.stringify(params) }),
  },

  // Diagnostics
  diagnostics: {
    get: (): Promise<DiagnosticsResponse> => apiFetch('/diagnostics'),
  },
};