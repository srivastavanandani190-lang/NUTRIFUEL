/**
 * API Diagnostic Tool
 * 
 * This component helps diagnose API connectivity issues and provides
 * clear instructions for setting up the Edamam API integration.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/db/supabase';
import { Loader2, CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface DiagnosticResult {
  step: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const APIDiagnostic: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [copied, setCopied] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    setResults([]);

    const diagnosticResults: DiagnosticResult[] = [];

    // Step 1: Test Edge Function connectivity
    diagnosticResults.push({
      step: 'Edge Function Connectivity',
      status: 'pending',
      message: 'Testing connection to Supabase Edge Function...',
    });
    setResults([...diagnosticResults]);

    try {
      const { data, error } = await supabase.functions.invoke('search-foods?query=apple&limit=5', {
        method: 'GET',
      });

      if (error) {
        diagnosticResults[0] = {
          step: 'Edge Function Connectivity',
          status: 'error',
          message: 'Failed to connect to Edge Function',
          details: error.message,
        };
      } else {
        diagnosticResults[0] = {
          step: 'Edge Function Connectivity',
          status: 'success',
          message: 'Successfully connected to Edge Function',
        };

        // Step 2: Check API response
        diagnosticResults.push({
          step: 'API Response Validation',
          status: 'pending',
          message: 'Validating API response format...',
        });
        setResults([...diagnosticResults]);

        await new Promise(resolve => setTimeout(resolve, 500));

        if (!data || !data.foods) {
          diagnosticResults[1] = {
            step: 'API Response Validation',
            status: 'error',
            message: 'Invalid response format from Edge Function',
            details: 'Response does not contain expected "foods" array',
          };
        } else {
          diagnosticResults[1] = {
            step: 'API Response Validation',
            status: 'success',
            message: 'API response format is valid',
          };

          // Step 3: Check data source
          diagnosticResults.push({
            step: 'Data Source Detection',
            status: 'pending',
            message: 'Checking data source...',
          });
          setResults([...diagnosticResults]);

          await new Promise(resolve => setTimeout(resolve, 500));

          if (data.source === 'mock') {
            diagnosticResults[2] = {
              step: 'Data Source Detection',
              status: 'warning',
              message: 'Using offline mock data',
              details: 'Edamam API keys are not configured. The system is working but using limited offline data (35 foods).',
            };
          } else if (data.source === 'edamam') {
            diagnosticResults[2] = {
              step: 'Data Source Detection',
              status: 'success',
              message: 'Connected to Edamam API (900,000+ foods)',
              details: `Successfully retrieved ${data.foods.length} foods from Edamam Food Database`,
            };
          }

          // Step 4: Test food data quality
          diagnosticResults.push({
            step: 'Data Quality Check',
            status: 'pending',
            message: 'Validating food data...',
          });
          setResults([...diagnosticResults]);

          await new Promise(resolve => setTimeout(resolve, 500));

          const sampleFood = data.foods[0];
          if (sampleFood && sampleFood.name && sampleFood.calories !== undefined) {
            diagnosticResults[3] = {
              step: 'Data Quality Check',
              status: 'success',
              message: 'Food data is complete and valid',
              details: `Sample: ${sampleFood.name} - ${sampleFood.calories} kcal`,
            };
          } else {
            diagnosticResults[3] = {
              step: 'Data Quality Check',
              status: 'error',
              message: 'Food data is incomplete',
              details: 'Some required fields are missing from food items',
            };
          }
        }
      }
    } catch (err: any) {
      diagnosticResults[0] = {
        step: 'Edge Function Connectivity',
        status: 'error',
        message: 'Failed to connect to Edge Function',
        details: err.message,
      };
    }

    setResults(diagnosticResults);
    setTesting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'pending':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/50';
      case 'error':
        return 'bg-red-500/10 border-red-500/50';
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/50';
      case 'pending':
        return 'bg-primary/10 border-primary/50';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-none rounded-[2.5rem]">
        <CardHeader>
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            🔧 API Diagnostic Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="glass border-primary/50 bg-primary/10">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              This tool helps diagnose connectivity issues with the Edamam Food Database API.
              Run the diagnostic to check your setup.
            </AlertDescription>
          </Alert>

          <Button
            onClick={runDiagnostics}
            disabled={testing}
            className="w-full rounded-2xl h-12 font-bold nav-gradient-btn text-white"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              'Run Diagnostic Test'
            )}
          </Button>

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Diagnostic Results:</h3>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border-2 ${getStatusColor(result.status)} transition-all`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-bold text-sm mb-1">{result.step}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                      {result.details && (
                        <div className="text-xs text-muted-foreground mt-2 p-2 bg-background/50 rounded-lg">
                          {result.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && results.some(r => r.status === 'warning' || r.status === 'error') && (
            <Alert className="glass border-orange-500/50 bg-orange-500/10">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-sm space-y-4">
                <div className="font-bold">Setup Required: Configure Edamam API Keys</div>
                
                <div className="space-y-2">
                  <div className="font-semibold text-xs">Step 1: Get Free API Keys</div>
                  <div className="text-xs">
                    Visit Edamam Developer Portal to get your free API keys (10,000 calls/month):
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => window.open('https://developer.edamam.com/food-database-api', '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Open Edamam Developer Portal
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-xs">Step 2: Configure in Supabase</div>
                  <div className="text-xs">
                    Add these secrets in your Supabase Dashboard → Edge Functions:
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-background/50 px-3 py-2 rounded-lg text-xs">
                        EDAMAM_APP_ID
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => copyToClipboard('EDAMAM_APP_ID')}
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-background/50 px-3 py-2 rounded-lg text-xs">
                        EDAMAM_APP_KEY
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => copyToClipboard('EDAMAM_APP_KEY')}
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-xs">Step 3: Redeploy Edge Function</div>
                  <div className="text-xs">
                    After adding secrets, redeploy the search-foods Edge Function in Supabase Dashboard.
                  </div>
                </div>

                <div className="pt-2 border-t border-orange-500/20">
                  <div className="text-xs font-semibold mb-1">Note:</div>
                  <div className="text-xs">
                    The system works perfectly in offline mode with 35+ foods. API keys are optional
                    but unlock access to 900,000+ foods from Edamam.
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {results.length > 0 && results.every(r => r.status === 'success') && (
            <Alert className="glass border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-sm">
                <div className="font-bold mb-2">✅ All Systems Operational!</div>
                <div>
                  Your food database panel is fully configured and connected to Edamam API.
                  You have access to 900,000+ foods with real-time nutritional data.
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Reference Card */}
      <Card className="glass border-none rounded-[2.5rem]">
        <CardHeader>
          <CardTitle className="text-xl font-black">📚 Quick Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="bg-green-500/10 text-green-500 border-none shrink-0">
                Edamam
              </Badge>
              <div className="text-sm">
                <div className="font-bold">Live Data Mode</div>
                <div className="text-muted-foreground text-xs">
                  900,000+ foods with verified nutritional data, images, and categories
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="bg-orange-500/10 text-orange-500 border-none shrink-0">
                Offline
              </Badge>
              <div className="text-sm">
                <div className="font-bold">Mock Data Mode</div>
                <div className="text-muted-foreground text-xs">
                  35+ pre-loaded foods with accurate nutrition data (works without API keys)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-2">
              <div>
                <span className="font-bold">Free Tier:</span> 10,000 API calls per month
              </div>
              <div>
                <span className="font-bold">Response Time:</span> 1-3 seconds per search
              </div>
              <div>
                <span className="font-bold">Fallback:</span> Automatic switch to offline mode if API fails
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
