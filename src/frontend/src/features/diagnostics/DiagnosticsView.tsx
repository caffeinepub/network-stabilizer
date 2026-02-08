import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConnectivityMeasurement } from '../monitoring/types';
import { filterByTimeWindow, TimeWindow } from './timeWindow';
import LatencySparkline from './LatencySparkline';
import ImportExportPanel from '../export/ImportExportPanel';
import { CheckCircle2, XCircle } from 'lucide-react';

interface DiagnosticsViewProps {
  samples: ConnectivityMeasurement[];
  isAuthenticated: boolean;
}

export default function DiagnosticsView({ samples, isAuthenticated }: DiagnosticsViewProps) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('1h');

  const filteredSamples = filterByTimeWindow(samples, timeWindow);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Diagnostics</h2>
          <p className="text-muted-foreground mt-1">
            Detailed connectivity history and analysis
          </p>
        </div>
        <Select value={timeWindow} onValueChange={(v) => setTimeWindow(v as TimeWindow)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15m">Last 15 minutes</SelectItem>
            <SelectItem value="1h">Last hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Latency Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Latency Timeline</CardTitle>
          <CardDescription>
            Visual representation of connectivity over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LatencySparkline samples={filteredSamples} />
        </CardContent>
      </Card>

      {/* Recent Checks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Checks</CardTitle>
          <CardDescription>
            Detailed log of connectivity measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSamples.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No data available for the selected time window
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSamples.slice().reverse().map((sample, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {sample.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(sample.timestamp)}
                      </TableCell>
                      <TableCell>
                        {sample.latency !== null ? `${sample.latency}ms` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {sample.errorCategory || '-'}
                        {sample.errorMessage && (
                          <div className="text-xs mt-1">{sample.errorMessage}</div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import/Export Panel */}
      <ImportExportPanel 
        samples={filteredSamples}
        timeWindow={timeWindow}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
