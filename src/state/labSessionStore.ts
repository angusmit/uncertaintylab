/**
 * Lab Session Store - Session-scoped state management
 * 
 * Uses Zustand with sessionStorage persistence:
 * - State persists across route changes within the same tab
 * - State resets when tab is closed or browser is restarted
 * - Does NOT use localStorage (no persistence across sessions)
 * 
 * Session Validation:
 * - A unique session ID is generated on each page load
 * - This ID is stored ONLY in memory (window object)
 * - If the stored session ID doesn't match, state is cleared
 * - This ensures state resets even if browser restores sessionStorage
 * 
 * This store manages:
 * - Active data import mode (synthetic/csv/multi-csv)
 * - Synthetic chain parameters
 * - CSV column mappings
 * - Market parameters
 * - Import options and results
 * - Surface fitting parameters
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CSVColumnMapping, ImportDiagnostics, PerExpiryDiagnostics } from '@/lib/api/hooks';

// =============================================================================
// Session Validation
// =============================================================================

// Generate a unique session ID for this page load
// This is stored ONLY in memory, never persisted
const CURRENT_SESSION_ID = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Key used to store the session ID in sessionStorage
const SESSION_ID_KEY = 'uncertainty-lab-session-id';

/**
 * Check if this is a new browser session
 * Returns true if we should clear persisted state
 */
function isNewSession(): boolean {
  const storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);
  
  if (!storedSessionId || storedSessionId !== CURRENT_SESSION_ID) {
    // New session detected - update the stored ID
    sessionStorage.setItem(SESSION_ID_KEY, CURRENT_SESSION_ID);
    return storedSessionId !== null; // Only clear if there was old data
  }
  
  return false;
}

/**
 * Clear session data if this is a new browser session
 * Called on module initialization
 */
function clearIfNewSession(): void {
  if (isNewSession()) {
    // Clear the persisted store data
    sessionStorage.removeItem('uncertainty-lab-session-v1');
    console.log('[LabSession] New session detected, cleared previous state');
  }
}

// Run session check on module load
clearIfNewSession();

// =============================================================================
// Types
// =============================================================================

export type DataMode = 'synthetic' | 'csv' | 'multi-csv';
export type ExpiryMode = 'column' | 'date' | 'T';
export type PriceSource = 'bid_ask_mid' | 'last' | 'mark' | 'close' | 'mid';

export interface SyntheticParams {
  spot: number;
  rate: number;
  div_yield: number;
  base_vol: number;
  skew: number;
  smile: number;
  term_slope: number;
  n_strikes: number;
  n_expiries: number;
}

export interface MarketParams {
  spot: number;
  rate: number;
  div_yield: number;
}

export interface SyntheticSpreadConfig {
  enabled: boolean;
  spread_pct: number;
}

export interface SurfaceParams {
  h_x: number;
  h_y: number;
  option_type: 'call' | 'put';
}

export interface CSVImportResult {
  diagnostics: ImportDiagnostics;
  warnings: string[];
}

export interface MultiCSVImportResult {
  overall: Record<string, number | string>;
  perExpiry: PerExpiryDiagnostics[];
  warnings: string[];
}

export interface LabSessionState {
  // Version for migration
  version: number;
  
  // Session metadata
  sessionStarted: number; // timestamp
  lastUpdated: number; // timestamp
  
  // Active mode
  dataMode: DataMode;
  
  // Synthetic parameters
  syntheticParams: SyntheticParams;
  
  // CSV mapping
  csvMapping: Partial<CSVColumnMapping>;
  expiryMode: ExpiryMode;
  expiryDate: string;
  expiryT: number;
  
  // Market parameters (shared across CSV modes)
  marketParams: MarketParams;
  
  // Import options
  checkBounds: boolean;
  syntheticSpread: SyntheticSpreadConfig;
  
  // Import results (lightweight - no raw data)
  csvImportResult: CSVImportResult | null;
  multiCsvImportResult: MultiCSVImportResult | null;
  
  // Surface fitting parameters
  surfaceParams: SurfaceParams;
  
  // Actions
  setDataMode: (mode: DataMode) => void;
  setSyntheticParams: (params: Partial<SyntheticParams>) => void;
  setCSVMapping: (mapping: Partial<CSVColumnMapping>) => void;
  setExpiryMode: (mode: ExpiryMode) => void;
  setExpiryDate: (date: string) => void;
  setExpiryT: (T: number) => void;
  setMarketParams: (params: Partial<MarketParams>) => void;
  setCheckBounds: (check: boolean) => void;
  setSyntheticSpread: (config: Partial<SyntheticSpreadConfig>) => void;
  setCSVImportResult: (result: CSVImportResult | null) => void;
  setMultiCSVImportResult: (result: MultiCSVImportResult | null) => void;
  setSurfaceParams: (params: Partial<SurfaceParams>) => void;
  
  // Reset
  resetSession: () => void;
}

// =============================================================================
// Default State
// =============================================================================

const defaultSyntheticParams: SyntheticParams = {
  spot: 100,
  rate: 0.05,
  div_yield: 0.02,
  base_vol: 0.2,
  skew: -0.1,
  smile: 0.1,
  term_slope: -0.02,
  n_strikes: 15,
  n_expiries: 6,
};

const defaultMarketParams: MarketParams = {
  spot: 100,
  rate: 0.05,
  div_yield: 0.02,
};

const defaultCSVMapping: Partial<CSVColumnMapping> = {
  price_source: 'bid_ask_mid',
  strike_has_suffix: false,
};

const defaultSyntheticSpread: SyntheticSpreadConfig = {
  enabled: false,
  spread_pct: 0.02,
};

const defaultSurfaceParams: SurfaceParams = {
  h_x: 0.15,
  h_y: 0.15,
  option_type: 'call',
};

const getInitialState = () => ({
  version: 1,
  sessionStarted: Date.now(),
  lastUpdated: Date.now(),
  dataMode: 'synthetic' as DataMode,
  syntheticParams: { ...defaultSyntheticParams },
  csvMapping: { ...defaultCSVMapping },
  expiryMode: 'column' as ExpiryMode,
  expiryDate: '',
  expiryT: 0.25,
  marketParams: { ...defaultMarketParams },
  checkBounds: true,
  syntheticSpread: { ...defaultSyntheticSpread },
  csvImportResult: null,
  multiCsvImportResult: null,
  surfaceParams: { ...defaultSurfaceParams },
});

// =============================================================================
// Store
// =============================================================================

export const useLabSessionStore = create<LabSessionState>()(
  persist(
    (set) => ({
      ...getInitialState(),
      
      // Actions
      setDataMode: (mode) => set({ dataMode: mode, lastUpdated: Date.now() }),
      
      setSyntheticParams: (params) => set((state) => ({
        syntheticParams: { ...state.syntheticParams, ...params },
        lastUpdated: Date.now(),
      })),
      
      setCSVMapping: (mapping) => set((state) => ({
        csvMapping: { ...state.csvMapping, ...mapping },
        lastUpdated: Date.now(),
      })),
      
      setExpiryMode: (mode) => set({ expiryMode: mode, lastUpdated: Date.now() }),
      setExpiryDate: (date) => set({ expiryDate: date, lastUpdated: Date.now() }),
      setExpiryT: (T) => set({ expiryT: T, lastUpdated: Date.now() }),
      
      setMarketParams: (params) => set((state) => ({
        marketParams: { ...state.marketParams, ...params },
        lastUpdated: Date.now(),
      })),
      
      setCheckBounds: (check) => set({ checkBounds: check, lastUpdated: Date.now() }),
      
      setSyntheticSpread: (config) => set((state) => ({
        syntheticSpread: { ...state.syntheticSpread, ...config },
        lastUpdated: Date.now(),
      })),
      
      setCSVImportResult: (result) => set({ csvImportResult: result, lastUpdated: Date.now() }),
      setMultiCSVImportResult: (result) => set({ multiCsvImportResult: result, lastUpdated: Date.now() }),
      
      setSurfaceParams: (params) => set((state) => ({
        surfaceParams: { ...state.surfaceParams, ...params },
        lastUpdated: Date.now(),
      })),
      
      resetSession: () => set({
        ...getInitialState(),
        sessionStarted: Date.now(),
      }),
    }),
    {
      name: 'uncertainty-lab-session-v1',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist these keys (exclude functions)
      partialize: (state) => ({
        version: state.version,
        sessionStarted: state.sessionStarted,
        lastUpdated: state.lastUpdated,
        dataMode: state.dataMode,
        syntheticParams: state.syntheticParams,
        csvMapping: state.csvMapping,
        expiryMode: state.expiryMode,
        expiryDate: state.expiryDate,
        expiryT: state.expiryT,
        marketParams: state.marketParams,
        checkBounds: state.checkBounds,
        syntheticSpread: state.syntheticSpread,
        csvImportResult: state.csvImportResult,
        multiCsvImportResult: state.multiCsvImportResult,
        surfaceParams: state.surfaceParams,
      }),
    }
  )
);

// =============================================================================
// Selectors (for convenience)
// =============================================================================

export const selectSyntheticParams = (state: LabSessionState) => state.syntheticParams;
export const selectCSVMapping = (state: LabSessionState) => state.csvMapping;
export const selectMarketParams = (state: LabSessionState) => state.marketParams;
export const selectSurfaceParams = (state: LabSessionState) => state.surfaceParams;
export const selectDataMode = (state: LabSessionState) => state.dataMode;

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to get session age in human-readable format
 */
export function useSessionInfo() {
  const sessionStarted = useLabSessionStore((state) => state.sessionStarted);
  const lastUpdated = useLabSessionStore((state) => state.lastUpdated);
  
  const getRelativeTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  return {
    sessionAge: getRelativeTime(sessionStarted),
    lastUpdated: getRelativeTime(lastUpdated),
  };
}