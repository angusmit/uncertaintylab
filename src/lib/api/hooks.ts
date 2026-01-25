/**
 * Uncertainty Lab React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  api,
  SyntheticChainRequest,
  CSVImportRequest,
  MultiCSVImportRequest,
  ComputeIVRequest,
  FitSurfaceRequest,
  SurfaceGridRequest,
  EuropeanPriceRequest,
  MCConvergenceRequest,
} from './index';

// Re-export types for convenience
export type {
  Quote,
  ChainResponse,
  SyntheticChainRequest,
  CSVColumnMapping,
  SyntheticSpreadConfig,
  CSVImportRequest,
  CSVDetectResponse,
  CSVImportResponse,
  ImportDiagnostics,
  MultiCSVFileDetect,
  MultiCSVDetectResponse,
  MultiCSVFileInput,
  MultiCSVImportRequest,
  PerExpiryDiagnostics,
  MultiCSVImportResponse,
  ComputeIVRequest,
  ComputeIVResponse,
  FitSurfaceRequest,
  FitSurfaceResponse,
  SurfaceGridRequest,
  SurfaceGridResponse,
  EuropeanPriceRequest,
  EuropeanPriceResponse,
  MCConvergenceRequest,
  MCConvergenceResponse,
  DiagnosticsResponse,
} from './index';

// Query keys
export const queryKeys = {
  chain: ['chain'] as const,
  diagnostics: ['diagnostics'] as const,
  surfaceGrid: (params: SurfaceGridRequest) => ['surface', 'grid', params] as const,
};

// Chain hooks
export function useChain() {
  return useQuery({
    queryKey: queryKeys.chain,
    queryFn: () => api.chain.get(),
    retry: false,
    staleTime: Infinity,
  });
}

export function useCreateSyntheticChain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: SyntheticChainRequest) => api.chain.createSynthetic(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chain });
      queryClient.invalidateQueries({ queryKey: queryKeys.diagnostics });
    },
  });
}

export function useResetState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.chain.reset(),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

// CSV hooks
export function useDetectCSV() {
  return useMutation({
    mutationFn: (file: File) => api.csv.detect(file),
  });
}

export function useImportCSV() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CSVImportRequest) => api.csv.import(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chain });
      queryClient.invalidateQueries({ queryKey: queryKeys.diagnostics });
    },
  });
}

// Multi-CSV hooks
export function useDetectMultiCSV() {
  return useMutation({
    mutationFn: (files: File[]) => api.multiCsv.detect(files),
  });
}

export function useImportMultiCSV() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: MultiCSVImportRequest) => api.multiCsv.import(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chain });
      queryClient.invalidateQueries({ queryKey: queryKeys.diagnostics });
    },
  });
}

// IV hooks
export function useComputeIV() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: ComputeIVRequest = {}) => api.iv.compute(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chain });
      queryClient.invalidateQueries({ queryKey: queryKeys.diagnostics });
    },
  });
}

// Surface hooks
export function useFitSurface() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: FitSurfaceRequest = {}) => api.surface.fit(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.diagnostics });
    },
  });
}

export function useFetchSurfaceGrid() {
  return useMutation({
    mutationFn: (params: SurfaceGridRequest) => api.surface.grid(params),
  });
}

// Pricing hooks
export function usePriceEuropean() {
  return useMutation({
    mutationFn: (params: EuropeanPriceRequest) => api.pricing.european(params),
  });
}

export function useMCConvergence() {
  return useMutation({
    mutationFn: (params: MCConvergenceRequest) => api.pricing.mcConvergence(params),
  });
}

// Diagnostics hook
export function useDiagnostics() {
  return useQuery({
    queryKey: queryKeys.diagnostics,
    queryFn: () => api.diagnostics.get(),
    refetchInterval: 5000,
  });
}