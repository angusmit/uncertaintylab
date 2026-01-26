/**
 * Data Import Page - Comprehensive CSV Import Workspace
 * 
 * Features:
 * - Synthetic chain generation
 * - Single CSV file upload with drag & drop
 * - Multi-CSV upload for multiple expiries
 * - Complete column mapping (strike, bid, ask, last, mark, close, expiry)
 * - Strike suffix parsing (62.5C -> strike=62.5, type=call)
 * - Expiry override (date picker or T in years)
 * - Synthetic bid/ask generation
 * - Price source selection
 * - Bounds checking toggle
 * - Full diagnostics panel with warnings
 * 
 * State is persisted to sessionStorage for continuity across route changes.
 */

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileSpreadsheet,
  Settings2,
  ChevronDown,
  ChevronUp,
  Info,
  Files,
  X,
  Calendar,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  useCreateSyntheticChain,
  useComputeIV,
  useDiagnostics,
  useDetectCSV,
  useImportCSV,
  useDetectMultiCSV,
  useImportMultiCSV,
  useResetState,
  CSVDetectResponse,
  CSVColumnMapping,
  ImportDiagnostics,
  MultiCSVFileDetect,
  MultiCSVDetectResponse,
  PerExpiryDiagnostics,
} from '@/lib/api/hooks';
import { cn } from '@/lib/utils';
import { useLabSessionStore, useSessionInfo, type DataMode } from '@/state/labSessionStore';

// Price source options
const PRICE_SOURCES = [
  { value: 'bid_ask_mid', label: 'Bid/Ask Midpoint', description: 'Best for liquid options' },
  { value: 'last', label: 'Last Trade', description: 'Most recent trade price' },
  { value: 'mark', label: 'Mark Price', description: 'Exchange theoretical price' },
  { value: 'close', label: 'Close Price', description: 'Previous day close' },
  { value: 'mid', label: 'Mid Column', description: 'Pre-calculated mid in CSV' },
] as const;

export default function DataImportPage() {
  const dataMode = useLabSessionStore((state) => state.dataMode);
  const setDataMode = useLabSessionStore((state) => state.setDataMode);
  const resetSession = useLabSessionStore((state) => state.resetSession);
  const resetBackend = useResetState();
  const { sessionAge } = useSessionInfo();

  const handleResetSession = async () => {
    try {
      // Reset backend state
      await resetBackend.mutateAsync();
      // Reset frontend session state
      resetSession();
      toast.success('Session reset to defaults');
    } catch (error) {
      toast.error('Failed to reset session');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Import</h1>
          <p className="text-muted-foreground">
            Load option chain data from CSV or generate synthetic data for experiments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Session: {sessionAge}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetSession}
            disabled={resetBackend.isPending}
            className="gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Session
          </Button>
        </div>
      </div>

      <Tabs value={dataMode} onValueChange={(v) => setDataMode(v as DataMode)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="synthetic" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Synthetic
          </TabsTrigger>
          <TabsTrigger value="csv" className="gap-2">
            <Upload className="w-4 h-4" />
            Single CSV
          </TabsTrigger>
          <TabsTrigger value="multi-csv" className="gap-2">
            <Files className="w-4 h-4" />
            Multi-CSV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="synthetic" className="mt-6">
          <SyntheticChainForm />
        </TabsContent>

        <TabsContent value="csv" className="mt-6">
          <CSVImportWorkspace />
        </TabsContent>

        <TabsContent value="multi-csv" className="mt-6">
          <MultiCSVImportWorkspace />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// =============================================================================
// Synthetic Chain Form
// =============================================================================

function SyntheticChainForm() {
  // Use session store for parameters
  const params = useLabSessionStore((state) => state.syntheticParams);
  const setParams = useLabSessionStore((state) => state.setSyntheticParams);

  const createChain = useCreateSyntheticChain();
  const computeIV = useComputeIV();
  const { data: diagnostics } = useDiagnostics();

  const handleGenerate = async () => {
    try {
      await createChain.mutateAsync(params);
      toast.success('Synthetic chain generated');
      await computeIV.mutateAsync({});
      toast.success('Implied volatilities computed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate chain');
    }
  };

  const updateParam = (key: string, value: number) => {
    setParams({ [key]: value });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Chain Parameters
          </CardTitle>
          <CardDescription>Configure synthetic option chain for experiments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Market Parameters */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Market
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Spot Price</Label>
                <Input
                  type="number"
                  value={params.spot}
                  onChange={(e) => updateParam('spot', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Rate</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={params.rate}
                  onChange={(e) => updateParam('rate', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Div Yield</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={params.div_yield}
                  onChange={(e) => updateParam('div_yield', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Vol Surface Shape */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Volatility Surface Shape
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Base Vol (ATM)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={params.base_vol}
                  onChange={(e) => updateParam('base_vol', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Skew Slope</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={params.skew}
                  onChange={(e) => updateParam('skew', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Smile Curvature</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={params.smile}
                  onChange={(e) => updateParam('smile', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Term Slope</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={params.term_slope}
                  onChange={(e) => updateParam('term_slope', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Grid Size */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Grid
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Strikes per Expiry</Label>
                <Input
                  type="number"
                  value={params.n_strikes}
                  onChange={(e) => updateParam('n_strikes', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Expiries</Label>
                <Input
                  type="number"
                  value={params.n_expiries}
                  onChange={(e) => updateParam('n_expiries', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={createChain.isPending || computeIV.isPending}
            className="w-full"
          >
            {createChain.isPending || computeIV.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate & Compute IV
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Pipeline Status</CardTitle>
        </CardHeader>
        <CardContent>
          {diagnostics ? (
            <div className="space-y-4">
              <StatusRow
                label="Chain Loaded"
                active={diagnostics.chain_loaded}
                value={diagnostics.chain_loaded ? `${diagnostics.n_quotes} quotes` : 'No'}
              />
              <StatusRow
                label="IV Computed"
                active={diagnostics.iv_computed}
                value={diagnostics.iv_computed ? `${diagnostics.n_valid_iv} valid` : 'No'}
              />
              <StatusRow
                label="Surface Fitted"
                active={diagnostics.surface_fitted}
                value={
                  diagnostics.surface_fitted
                    ? `RMSE: ${(diagnostics.surface_rmse! * 100).toFixed(2)}%`
                    : 'No'
                }
              />
            </div>
          ) : (
            <div className="text-muted-foreground">Loading...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// CSV Import Workspace
// =============================================================================

function CSVImportWorkspace() {
  // File state (not persisted - files can't be serialized)
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [detectResult, setDetectResult] = useState<CSVDetectResponse | null>(null);

  // Session store for persisted state
  const mapping = useLabSessionStore((state) => state.csvMapping);
  const setMapping = useLabSessionStore((state) => state.setCSVMapping);
  const expiryMode = useLabSessionStore((state) => state.expiryMode);
  const setExpiryMode = useLabSessionStore((state) => state.setExpiryMode);
  const expiryDate = useLabSessionStore((state) => state.expiryDate);
  const setExpiryDate = useLabSessionStore((state) => state.setExpiryDate);
  const expiryT = useLabSessionStore((state) => state.expiryT);
  const setExpiryT = useLabSessionStore((state) => state.setExpiryT);
  const marketParams = useLabSessionStore((state) => state.marketParams);
  const setMarketParams = useLabSessionStore((state) => state.setMarketParams);
  const checkBounds = useLabSessionStore((state) => state.checkBounds);
  const setCheckBounds = useLabSessionStore((state) => state.setCheckBounds);
  const syntheticSpread = useLabSessionStore((state) => state.syntheticSpread);
  const setSyntheticSpread = useLabSessionStore((state) => state.setSyntheticSpread);
  const importResult = useLabSessionStore((state) => state.csvImportResult);
  const setImportResult = useLabSessionStore((state) => state.setCSVImportResult);

  // Advanced section state (UI only, not persisted)
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Hooks
  const detectCSV = useDetectCSV();
  const importCSV = useImportCSV();
  const computeIV = useComputeIV();
  const { data: diagnostics } = useDiagnostics();

  // Handle file selection
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setImportResult(null);
    setDetectResult(null);

    // Read file content
    const text = await f.text();
    setCsvData(text);

    try {
      const result = await detectCSV.mutateAsync(f);
      setDetectResult(result);

      // Auto-fill mapping from candidates
      const newMapping: Partial<CSVColumnMapping> = {
        price_source: 'bid_ask_mid',
        strike_has_suffix: result.strike_has_suffix,
      };
      if (result.candidates.strike?.[0]) newMapping.strike_col = result.candidates.strike[0];
      if (result.candidates.option_type?.[0]) newMapping.option_type_col = result.candidates.option_type[0];
      if (result.candidates.bid?.[0]) newMapping.bid_col = result.candidates.bid[0];
      if (result.candidates.ask?.[0]) newMapping.ask_col = result.candidates.ask[0];
      if (result.candidates.last?.[0]) newMapping.last_col = result.candidates.last[0];
      if (result.candidates.mark?.[0]) newMapping.mark_col = result.candidates.mark[0];
      if (result.candidates.close?.[0]) newMapping.close_col = result.candidates.close[0];
      if (result.candidates.volume?.[0]) newMapping.volume_col = result.candidates.volume[0];
      if (result.candidates.oi?.[0]) newMapping.oi_col = result.candidates.oi[0];
      if (result.candidates.expiry?.[0]) {
        newMapping.expiry_col = result.candidates.expiry[0];
        setExpiryMode('column');
      }
      setMapping(newMapping);

      toast.success(`Detected ${result.n_rows} rows, ${result.columns.length} columns`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to detect CSV columns';
      toast.error(message);
      console.error('CSV detect error:', error);
    }
  };

  // Handle import
  const handleImport = async () => {
    if (!csvData || !mapping.strike_col) {
      toast.error('Please select a strike column');
      return;
    }

    // Validate expiry
    if (expiryMode !== 'column' && !mapping.expiry_col) {
      if (expiryMode === 'date' && !expiryDate) {
        toast.error('Please enter an expiry date');
        return;
      }
      if (expiryMode === 'T' && expiryT <= 0) {
        toast.error('Please enter a valid time to expiry');
        return;
      }
    }

    try {
      const result = await importCSV.mutateAsync({
        csv_data: csvData,
        mapping: {
          strike_col: mapping.strike_col!,
          option_type_col: mapping.option_type_col || null,
          price_source: mapping.price_source || 'bid_ask_mid',
          bid_col: mapping.bid_col || null,
          ask_col: mapping.ask_col || null,
          last_col: mapping.last_col || null,
          mark_col: mapping.mark_col || null,
          close_col: mapping.close_col || null,
          mid_col: mapping.mid_col || null,
          volume_col: mapping.volume_col || null,
          oi_col: mapping.oi_col || null,
          expiry_col: expiryMode === 'column' ? mapping.expiry_col || null : null,
          strike_has_suffix: mapping.strike_has_suffix || false,
        },
        spot: marketParams.spot,
        rate: marketParams.rate,
        div_yield: marketParams.div_yield,
        expiry_date: expiryMode === 'date' ? expiryDate : null,
        expiry_T: expiryMode === 'T' ? expiryT : null,
        check_bounds: checkBounds,
        synthetic_spread: syntheticSpread.enabled ? syntheticSpread : null,
      });

      setImportResult({
        diagnostics: result.diagnostics,
        warnings: result.warnings,
      });

      if (result.success) {
        toast.success(`Imported ${result.n_quotes} options`);
        await computeIV.mutateAsync({});
        toast.success('Implied volatilities computed');
      } else {
        toast.error('Import failed - check diagnostics');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import failed');
    }
  };

  // Render column selector
  const renderColumnSelect = (
    label: string,
    field: keyof CSVColumnMapping,
    placeholder: string = 'None',
    recommended?: string[]
  ) => (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Select
        value={(mapping[field] as string) || '__none__'}
        onValueChange={(v) => setMapping({ [field]: v === '__none__' ? undefined : v })}
      >
        <SelectTrigger className="h-9">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">— {placeholder} —</SelectItem>
          {detectResult?.columns.map((col) => (
            <SelectItem key={col} value={col}>
              {col}
              {recommended?.includes(col) && (
                <span className="ml-2 text-xs text-primary">recommended</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Step 1: File Upload */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Step 1: Upload CSV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
              file ? 'border-primary/50 bg-primary/5' : 'border-muted hover:border-primary/50 cursor-pointer'
            )}
          >
            <input
              type="file"
              accept=".csv,.txt"
              onChange={onFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
              {file ? (
                <>
                  <p className="font-medium text-primary">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {detectResult ? `${detectResult.n_rows} rows, ${detectResult.columns.length} columns` : 'Processing...'}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">Click to upload CSV</p>
                  <p className="text-sm text-muted-foreground">
                    Supports broker exports, exchange data, and custom formats
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Preview Table */}
          {detectResult && detectResult.preview && detectResult.preview.length > 0 && detectResult.columns && (
            <div className="mt-4 overflow-x-auto">
              <p className="text-sm text-muted-foreground mb-2">Preview (first 5 rows)</p>
              <table className="w-full text-xs border rounded-lg overflow-hidden">
                <thead className="bg-muted/50">
                  <tr>
                    {detectResult.columns.slice(0, 8).map((col, idx) => (
                      <th key={`${col}-${idx}`} className="px-2 py-1 text-left font-medium truncate max-w-[100px]">
                        {col}
                      </th>
                    ))}
                    {detectResult.columns.length > 8 && <th className="px-2 py-1">...</th>}
                  </tr>
                </thead>
                <tbody>
                  {detectResult.preview.slice(0, 3).map((row, i) => (
                    <tr key={i} className="border-t border-border/50">
                      {detectResult.columns.slice(0, 8).map((col, idx) => (
                        <td key={`${col}-${idx}`} className="px-2 py-1 truncate max-w-[100px]">
                          {String(row?.[col] ?? '')}
                        </td>
                      ))}
                      {detectResult.columns.length > 8 && <td className="px-2 py-1">...</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Column Mapping */}
      {detectResult && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Step 2: Column Mapping
            </CardTitle>
            <CardDescription>Map CSV columns to required fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderColumnSelect('Strike *', 'strike_col', 'Select...', detectResult?.candidates?.strike)}
              {renderColumnSelect('Option Type', 'option_type_col', 'From suffix', detectResult?.candidates?.option_type)}
              {renderColumnSelect('Bid', 'bid_col', 'None', detectResult?.candidates?.bid)}
              {renderColumnSelect('Ask', 'ask_col', 'None', detectResult?.candidates?.ask)}
            </div>

            {/* Strike Suffix Checkbox */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Switch
                checked={mapping.strike_has_suffix || false}
                onCheckedChange={(checked) => setMapping({ strike_has_suffix: checked })}
              />
              <div>
                <Label className="font-medium">Strike contains C/P suffix</Label>
                <p className="text-xs text-muted-foreground">
                  e.g., "62.5C" → strike=62.5, type=call
                </p>
              </div>
            </div>

            {/* Price Source */}
            <div className="space-y-2">
              <Label>Primary Price Source</Label>
              <Select
                value={mapping.price_source || 'bid_ask_mid'}
                onValueChange={(v) => setMapping({ price_source: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_SOURCES.map((src) => (
                    <SelectItem key={src.value} value={src.value}>
                      <div>
                        <span className="font-medium">{src.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{src.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Column Mapping */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span>Advanced Column Mapping</span>
                  {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {renderColumnSelect('Last/Latest', 'last_col', 'None', detectResult?.candidates?.last)}
                  {renderColumnSelect('Mark', 'mark_col', 'None', detectResult?.candidates?.mark)}
                  {renderColumnSelect('Close', 'close_col', 'None', detectResult?.candidates?.close)}
                  {renderColumnSelect('Mid', 'mid_col', 'None', detectResult?.candidates?.mid)}
                  {renderColumnSelect('Volume', 'volume_col', 'None', detectResult?.candidates?.volume)}
                  {renderColumnSelect('Open Interest', 'oi_col', 'None', detectResult?.candidates?.oi)}
                  {renderColumnSelect('Expiry', 'expiry_col', 'None', detectResult?.candidates?.expiry)}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Expiry Override */}
            <div className="space-y-3 p-4 rounded-lg border border-border/50">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Expiry Override</Label>
                <Tabs value={expiryMode} onValueChange={(v) => setExpiryMode(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="column" className="text-xs px-2">From Column</TabsTrigger>
                    <TabsTrigger value="date" className="text-xs px-2">Date</TabsTrigger>
                    <TabsTrigger value="T" className="text-xs px-2">T (years)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {expiryMode === 'date' && (
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="max-w-xs"
                />
              )}
              
              {expiryMode === 'T' && (
                <div className="flex items-center gap-4 max-w-xs">
                  <Slider
                    value={[expiryT]}
                    onValueChange={([v]) => setExpiryT(v)}
                    min={0.01}
                    max={2}
                    step={0.01}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-16">{expiryT.toFixed(2)}y</span>
                </div>
              )}
            </div>

            {/* Synthetic Spread */}
            <div className="space-y-3 p-4 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <Switch
                  checked={syntheticSpread.enabled}
                  onCheckedChange={(checked) => setSyntheticSpread({ enabled: checked })}
                />
                <div>
                  <Label className="font-medium">Generate Synthetic Bid/Ask</Label>
                  <p className="text-xs text-muted-foreground">
                    Create bid/ask from mid when real spread unavailable
                  </p>
                </div>
              </div>
              
              {syntheticSpread.enabled && (
                <div className="flex items-center gap-4 mt-2">
                  <Label className="text-sm">Spread %:</Label>
                  <Slider
                    value={[syntheticSpread.spread_pct * 100]}
                    onValueChange={([v]) => setSyntheticSpread({ spread_pct: v / 100 })}
                    min={0.5}
                    max={10}
                    step={0.5}
                    className="flex-1 max-w-[200px]"
                  />
                  <span className="text-sm font-mono w-12">{(syntheticSpread.spread_pct * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>

            {/* Market Parameters */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Spot Price *</Label>
                <Input
                  type="number"
                  value={marketParams.spot}
                  onChange={(e) => setMarketParams({ spot: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Rate (r)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={marketParams.rate}
                  onChange={(e) => setMarketParams({ rate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Dividend Yield (q)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={marketParams.div_yield}
                  onChange={(e) => setMarketParams({ div_yield: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={checkBounds} onCheckedChange={setCheckBounds} />
                <Label className="text-sm">Check price bounds (intrinsic value filter)</Label>
              </div>
            </div>

            {/* Import Button */}
            <Button
              onClick={handleImport}
              disabled={importCSV.isPending || computeIV.isPending || !mapping.strike_col}
              className="w-full"
              size="lg"
            >
              {importCSV.isPending || computeIV.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import & Compute IV
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Diagnostics */}
      {importResult && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Step 3: Import Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Warnings */}
            {importResult.warnings.length > 0 && (
              <div className="space-y-2">
                {importResult.warnings.map((warning, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-yellow-200">{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Diagnostics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DiagnosticCard
                label="Total Rows"
                value={importResult.diagnostics['Total Rows']}
                type="neutral"
              />
              <DiagnosticCard
                label="Valid Options"
                value={importResult.diagnostics['Valid Options']}
                type={importResult.diagnostics['Valid Options'] > 0 ? 'success' : 'error'}
              />
              <DiagnosticCard
                label="Real Bid/Ask"
                value={`${importResult.diagnostics['Using Real Bid/Ask']}`}
                subtitle={`${((importResult.diagnostics['Using Real Bid/Ask'] / Math.max(importResult.diagnostics['Valid Options'], 1)) * 100).toFixed(0)}%`}
                type={importResult.diagnostics['Using Real Bid/Ask'] > 0 ? 'success' : 'warning'}
              />
              <DiagnosticCard
                label="Price Source"
                value={importResult.diagnostics['Price Source']}
                type="neutral"
              />
            </div>

            {/* Dropped Rows */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <DiagnosticCard
                label="Invalid Strike"
                value={importResult.diagnostics['Dropped (Invalid Strike)']}
                type={importResult.diagnostics['Dropped (Invalid Strike)'] > 0 ? 'warning' : 'success'}
              />
              <DiagnosticCard
                label="Invalid Type"
                value={importResult.diagnostics['Dropped (Invalid Type)']}
                type={importResult.diagnostics['Dropped (Invalid Type)'] > 0 ? 'warning' : 'success'}
              />
              <DiagnosticCard
                label="Invalid Price"
                value={importResult.diagnostics['Dropped (Invalid Price)']}
                type={importResult.diagnostics['Dropped (Invalid Price)'] > 0 ? 'warning' : 'success'}
              />
              <DiagnosticCard
                label="Bounds Check"
                value={importResult.diagnostics['Dropped (Bounds Check)']}
                type={importResult.diagnostics['Dropped (Bounds Check)'] > 0 ? 'warning' : 'success'}
              />
              <DiagnosticCard
                label="Zero Price"
                value={importResult.diagnostics['Dropped (Zero Price)']}
                type={importResult.diagnostics['Dropped (Zero Price)'] > 0 ? 'warning' : 'success'}
              />
            </div>

            {/* Price Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DiagnosticCard label="Min Price" value={importResult.diagnostics['Min Price']} type="neutral" />
              <DiagnosticCard label="Max Price" value={importResult.diagnostics['Max Price']} type="neutral" />
              <DiagnosticCard label="Mean Price" value={importResult.diagnostics['Mean Price']} type="neutral" />
              <DiagnosticCard
                label="Expiry Source"
                value={importResult.diagnostics['Expiry Source'] || 'N/A'}
                type="neutral"
              />
            </div>

            {/* Volume/OI */}
            <div className="grid grid-cols-2 gap-4">
              <DiagnosticCard
                label="Total Volume"
                value={importResult.diagnostics['Total Volume'].toLocaleString()}
                type="neutral"
              />
              <DiagnosticCard
                label="Total Open Interest"
                value={importResult.diagnostics['Total Open Interest'].toLocaleString()}
                type="neutral"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// =============================================================================
// Helper Components
// =============================================================================

function StatusRow({ label, active, value }: { label: string; active: boolean; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
      <div className="flex items-center gap-3">
        {active ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-muted-foreground" />
        )}
        <span className="font-medium">{label}</span>
      </div>
      <span className={active ? 'text-foreground' : 'text-muted-foreground'}>{value}</span>
    </div>
  );
}

function DiagnosticCard({
  label,
  value,
  subtitle,
  type,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  type: 'success' | 'warning' | 'error' | 'neutral';
}) {
  const colors = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    neutral: 'text-foreground',
  };

  return (
    <div className="p-3 rounded-lg bg-muted/30">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className={cn('text-lg font-bold', colors[type])}>{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  );
}

// =============================================================================
// Multi-CSV Import Workspace
// =============================================================================

interface FileWithData {
  file: File;
  csvData: string;
  info?: MultiCSVFileDetect;
  expiryOverride?: string;
  expiryT?: number;
}

function MultiCSVImportWorkspace() {
  // Files state (not persisted - files can't be serialized)
  const [files, setFiles] = useState<FileWithData[]>([]);
  const [detectResult, setDetectResult] = useState<MultiCSVDetectResponse | null>(null);

  // Session store for persisted state
  const mapping = useLabSessionStore((state) => state.csvMapping);
  const setMapping = useLabSessionStore((state) => state.setCSVMapping);
  const marketParams = useLabSessionStore((state) => state.marketParams);
  const setMarketParams = useLabSessionStore((state) => state.setMarketParams);
  const checkBounds = useLabSessionStore((state) => state.checkBounds);
  const setCheckBounds = useLabSessionStore((state) => state.setCheckBounds);
  const syntheticSpread = useLabSessionStore((state) => state.syntheticSpread);
  const setSyntheticSpread = useLabSessionStore((state) => state.setSyntheticSpread);
  const importResult = useLabSessionStore((state) => state.multiCsvImportResult);
  const setImportResult = useLabSessionStore((state) => state.setMultiCSVImportResult);

  // Advanced section state (UI only, not persisted)
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Hooks
  const detectMultiCSV = useDetectMultiCSV();
  const importMultiCSV = useImportMultiCSV();
  const computeIV = useComputeIV();

  // Handle file selection
  const onFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Read all files
    const newFiles: FileWithData[] = await Promise.all(
      selectedFiles.map(async (file) => ({
        file,
        csvData: await file.text(),
      }))
    );

    setFiles((prev) => [...prev, ...newFiles]);
    setImportResult(null);

    // Detect all files
    const allFiles = [...files, ...newFiles].map((f) => f.file);
    try {
      const result = await detectMultiCSV.mutateAsync(allFiles);
      setDetectResult(result);

      // Update files with detection info
      setFiles((prev) =>
        prev.map((f) => {
          const info = result.files.find((r) => r.filename === f.file.name);
          return {
            ...f,
            info,
            expiryOverride: info?.inferred_expiry || f.expiryOverride,
          };
        })
      );

      // Auto-fill mapping from first file's candidates
      if (result.files.length > 0) {
        const firstFile = result.files[0];
        if (!firstFile.error) {
          const newMapping: Partial<CSVColumnMapping> = {
            price_source: 'bid_ask_mid',
            strike_has_suffix: firstFile.strike_has_suffix,
          };
          if (firstFile.candidates?.strike?.[0]) newMapping.strike_col = firstFile.candidates.strike[0];
          if (firstFile.candidates?.option_type?.[0]) newMapping.option_type_col = firstFile.candidates.option_type[0];
          if (firstFile.candidates?.bid?.[0]) newMapping.bid_col = firstFile.candidates.bid[0];
          if (firstFile.candidates?.ask?.[0]) newMapping.ask_col = firstFile.candidates.ask[0];
          if (firstFile.candidates?.last?.[0]) newMapping.last_col = firstFile.candidates.last[0];
          if (firstFile.candidates?.volume?.[0]) newMapping.volume_col = firstFile.candidates.volume[0];
          if (firstFile.candidates?.oi?.[0]) newMapping.oi_col = firstFile.candidates.oi[0];
          setMapping(newMapping);
        }
      }

      toast.success(`Detected ${result.files.length} files, ${result.common_columns.length} common columns`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to detect CSV files';
      toast.error(message);
    }
  };

  // Remove a file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setImportResult(null);
  };

  // Update expiry for a file
  const updateFileExpiry = (index: number, expiry: string) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, expiryOverride: expiry } : f))
    );
  };

  // Handle import
  const handleImport = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one CSV file');
      return;
    }

    if (!mapping.strike_col) {
      toast.error('Please select a strike column');
      return;
    }

    // Check all files have expiry
    const missingExpiry = files.filter((f) => !f.expiryOverride && !f.info?.has_expiry_column);
    if (missingExpiry.length > 0) {
      toast.error(`Please set expiry for: ${missingExpiry.map((f) => f.file.name).join(', ')}`);
      return;
    }

    try {
      const result = await importMultiCSV.mutateAsync({
        files: files.map((f) => ({
          csv_data: f.csvData,
          filename: f.file.name,
          expiry_date: f.expiryOverride || null,
          expiry_T: f.expiryT || null,
        })),
        mapping: {
          strike_col: mapping.strike_col!,
          option_type_col: mapping.option_type_col || null,
          price_source: mapping.price_source || 'bid_ask_mid',
          bid_col: mapping.bid_col || null,
          ask_col: mapping.ask_col || null,
          last_col: mapping.last_col || null,
          mark_col: mapping.mark_col || null,
          close_col: mapping.close_col || null,
          mid_col: mapping.mid_col || null,
          volume_col: mapping.volume_col || null,
          oi_col: mapping.oi_col || null,
          expiry_col: null, // Using overrides per file
          strike_has_suffix: mapping.strike_has_suffix || false,
        },
        spot: marketParams.spot,
        rate: marketParams.rate,
        div_yield: marketParams.div_yield,
        check_bounds: checkBounds,
        synthetic_spread: syntheticSpread.enabled ? syntheticSpread : null,
      });

      setImportResult({
        perExpiry: result.per_expiry,
        overall: result.overall_diagnostics,
        warnings: result.warnings,
      });

      if (result.success) {
        toast.success(`Imported ${result.n_quotes} options across ${result.n_expiries} expiries`);
        await computeIV.mutateAsync({});
        toast.success('Implied volatilities computed');
      } else {
        toast.error('Import failed - check diagnostics');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import failed');
    }
  };

  // Render column selector (shared with single CSV)
  const renderColumnSelect = (
    label: string,
    field: keyof CSVColumnMapping,
    placeholder: string = 'None',
    recommended?: string[]
  ) => (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Select
        value={(mapping[field] as string) || '__none__'}
        onValueChange={(v) => setMapping({ [field]: v === '__none__' ? undefined : v })}
      >
        <SelectTrigger className="h-9">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">— {placeholder} —</SelectItem>
          {detectResult?.common_columns.map((col) => (
            <SelectItem key={col} value={col}>
              {col}
              {recommended?.includes(col) && (
                <span className="ml-2 text-xs text-primary">recommended</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Step 1: File Upload */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Files className="w-5 h-5 text-primary" />
            Step 1: Upload Multiple CSVs
          </CardTitle>
          <CardDescription>
            Upload 2-10 CSV files representing different expiries for the same underlying
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
              files.length > 0 ? 'border-primary/50 bg-primary/5' : 'border-muted hover:border-primary/50 cursor-pointer'
            )}
          >
            <input
              type="file"
              accept=".csv,.txt"
              multiple
              onChange={onFilesChange}
              className="hidden"
              id="multi-csv-upload"
            />
            <label htmlFor="multi-csv-upload" className="cursor-pointer">
              <Files className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
              <p className="font-medium">Click to upload multiple CSV files</p>
              <p className="text-sm text-muted-foreground">
                Each file should contain one expiry. Hold Ctrl/Cmd to select multiple.
              </p>
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Files ({files.length})</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFiles([]);
                    setDetectResult(null);
                    setImportResult(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left">File</th>
                      <th className="px-3 py-2 text-left">Rows</th>
                      <th className="px-3 py-2 text-left">Expiry</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((f, i) => (
                      <tr key={i} className="border-t border-border/50">
                        <td className="px-3 py-2 font-mono text-xs truncate max-w-[200px]">
                          {f.file.name}
                        </td>
                        <td className="px-3 py-2">{f.info?.n_rows || '—'}</td>
                        <td className="px-3 py-2">
                          <Input
                            type="date"
                            value={f.expiryOverride || ''}
                            onChange={(e) => updateFileExpiry(i, e.target.value)}
                            className="h-7 w-36 text-xs"
                            placeholder="YYYY-MM-DD"
                          />
                        </td>
                        <td className="px-3 py-2">
                          {f.info?.error ? (
                            <span className="text-red-500 text-xs">{f.info.error}</span>
                          ) : f.info ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <Button variant="ghost" size="sm" onClick={() => removeFile(i)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Schema Warnings */}
          {detectResult && !detectResult.schema_valid && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400">Schema Mismatch</p>
                  <p className="text-xs text-red-300 mt-1">
                    CSV files have different columns. Please use files from the same data source.
                  </p>
                </div>
              </div>
            </div>
          )}

          {detectResult?.schema_warnings && detectResult.schema_warnings.length > 0 && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-400">Schema Warnings</p>
                  {detectResult.schema_warnings.map((w, i) => (
                    <p key={i} className="text-xs text-yellow-300 mt-1">{w}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Column Mapping (only show if files detected) */}
      {detectResult && detectResult.common_columns.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Step 2: Column Mapping
            </CardTitle>
            <CardDescription>
              Map columns (shared across all files). Common columns: {detectResult.common_columns.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderColumnSelect('Strike *', 'strike_col', 'Select...')}
              {renderColumnSelect('Option Type', 'option_type_col', 'From suffix')}
              {renderColumnSelect('Bid', 'bid_col', 'None')}
              {renderColumnSelect('Ask', 'ask_col', 'None')}
            </div>

            {/* Strike Suffix Checkbox */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Switch
                checked={mapping.strike_has_suffix || false}
                onCheckedChange={(checked) => setMapping({ strike_has_suffix: checked })}
              />
              <div>
                <Label className="font-medium">Strike contains C/P suffix</Label>
                <p className="text-xs text-muted-foreground">e.g., "62.5C" → strike=62.5, type=call</p>
              </div>
            </div>

            {/* Price Source */}
            <div className="space-y-2">
              <Label>Primary Price Source</Label>
              <Select
                value={mapping.price_source || 'bid_ask_mid'}
                onValueChange={(v) => setMapping({ price_source: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_SOURCES.map((src) => (
                    <SelectItem key={src.value} value={src.value}>
                      <span className="font-medium">{src.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{src.description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Column Mapping */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span>Advanced Column Mapping</span>
                  {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {renderColumnSelect('Last/Latest', 'last_col', 'None')}
                  {renderColumnSelect('Mark', 'mark_col', 'None')}
                  {renderColumnSelect('Close', 'close_col', 'None')}
                  {renderColumnSelect('Volume', 'volume_col', 'None')}
                  {renderColumnSelect('Open Interest', 'oi_col', 'None')}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Synthetic Spread */}
            <div className="space-y-3 p-4 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <Switch
                  checked={syntheticSpread.enabled}
                  onCheckedChange={(checked) => setSyntheticSpread({ enabled: checked })}
                />
                <div>
                  <Label className="font-medium">Generate Synthetic Bid/Ask</Label>
                  <p className="text-xs text-muted-foreground">Create bid/ask from mid when real spread unavailable</p>
                </div>
              </div>
              {syntheticSpread.enabled && (
                <div className="flex items-center gap-4 mt-2">
                  <Label className="text-sm">Spread %:</Label>
                  <Slider
                    value={[syntheticSpread.spread_pct * 100]}
                    onValueChange={([v]) => setSyntheticSpread({ spread_pct: v / 100 })}
                    min={0.5}
                    max={10}
                    step={0.5}
                    className="flex-1 max-w-[200px]"
                  />
                  <span className="text-sm font-mono w-12">{(syntheticSpread.spread_pct * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>

            {/* Market Parameters */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Spot Price *</Label>
                <Input
                  type="number"
                  value={marketParams.spot}
                  onChange={(e) => setMarketParams({ spot: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Rate (r)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={marketParams.rate}
                  onChange={(e) => setMarketParams({ rate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Dividend Yield (q)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={marketParams.div_yield}
                  onChange={(e) => setMarketParams({ div_yield: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-2">
              <Switch checked={checkBounds} onCheckedChange={setCheckBounds} />
              <Label className="text-sm">Check price bounds (intrinsic value filter)</Label>
            </div>

            {/* Import Button */}
            <Button
              onClick={handleImport}
              disabled={importMultiCSV.isPending || computeIV.isPending || files.length === 0 || !mapping.strike_col}
              className="w-full"
              size="lg"
            >
              {importMultiCSV.isPending || computeIV.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing & Merging...
                </>
              ) : (
                <>
                  <Files className="w-4 h-4 mr-2" />
                  Import {files.length} Files & Compute IV
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Diagnostics */}
      {importResult && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Step 3: Merge Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Warnings */}
            {importResult.warnings.length > 0 && (
              <div className="space-y-2">
                {importResult.warnings.slice(0, 5).map((warning, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-yellow-200">{warning}</span>
                  </div>
                ))}
                {importResult.warnings.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    ... and {importResult.warnings.length - 5} more warnings
                  </p>
                )}
              </div>
            )}

            {/* Overall Stats */}
            <div>
              <h4 className="text-sm font-medium mb-3">Overall Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DiagnosticCard
                  label="Total Options"
                  value={importResult.overall['Total Options'] || 0}
                  type="success"
                />
                <DiagnosticCard
                  label="Expiries"
                  value={importResult.overall['Expiries'] || 0}
                  type="neutral"
                />
                <DiagnosticCard
                  label="Unique Strikes"
                  value={importResult.overall['Unique Strikes'] || 0}
                  type="neutral"
                />
                <DiagnosticCard
                  label="Files Processed"
                  value={`${importResult.overall['Files With Data'] || 0}/${importResult.overall['Files Processed'] || 0}`}
                  type={importResult.overall['Files With Data'] === importResult.overall['Files Processed'] ? 'success' : 'warning'}
                />
              </div>
            </div>

            {/* Per-Expiry Stats */}
            <div>
              <h4 className="text-sm font-medium mb-3">Per-Expiry Breakdown</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Expiry</th>
                      <th className="px-3 py-2 text-left">T (years)</th>
                      <th className="px-3 py-2 text-left">Valid</th>
                      <th className="px-3 py-2 text-left">% Valid</th>
                      <th className="px-3 py-2 text-left">ATM Strike</th>
                      <th className="px-3 py-2 text-left">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importResult.perExpiry
                      .sort((a, b) => a.T - b.T)
                      .map((exp, i) => (
                        <tr key={i} className="border-t border-border/50">
                          <td className="px-3 py-2 font-medium">{exp.expiry}</td>
                          <td className="px-3 py-2 font-mono">{exp.T.toFixed(3)}</td>
                          <td className="px-3 py-2">{exp.n_valid}</td>
                          <td className="px-3 py-2">
                            <span className={cn(
                              exp.pct_valid >= 80 ? 'text-green-500' :
                              exp.pct_valid >= 50 ? 'text-yellow-500' : 'text-red-500'
                            )}>
                              {exp.pct_valid.toFixed(0)}%
                            </span>
                          </td>
                          <td className="px-3 py-2 font-mono">{exp.atm_strike?.toFixed(2) || '—'}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground truncate max-w-[150px]">
                            {exp.source_file}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Surface Coverage */}
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="text-sm font-medium mb-2">Surface Coverage</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Strike Range:</span>
                  <span className="ml-2 font-mono">
                    {importResult.overall['Min Strike']} — {importResult.overall['Max Strike']}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Maturity Range:</span>
                  <span className="ml-2 font-mono">
                    {typeof importResult.overall['Min T'] === 'number' 
                      ? (importResult.overall['Min T'] as number).toFixed(3) 
                      : importResult.overall['Min T']}y — {typeof importResult.overall['Max T'] === 'number'
                      ? (importResult.overall['Max T'] as number).toFixed(3)
                      : importResult.overall['Max T']}y
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}