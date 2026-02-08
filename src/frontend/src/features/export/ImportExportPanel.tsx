import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ConnectivityMeasurement } from '../monitoring/types';
import { TimeWindow } from '../diagnostics/timeWindow';
import { exportToCSV, exportToJSON } from './exportFormats';
import { downloadFile } from './fileDownload';
import { useClearHistory } from '../history/mutations';
import { Download, FileJson, FileSpreadsheet, Trash2 } from 'lucide-react';

interface ImportExportPanelProps {
  samples: ConnectivityMeasurement[];
  timeWindow: TimeWindow;
  isAuthenticated: boolean;
}

export default function ImportExportPanel({ samples, timeWindow, isAuthenticated }: ImportExportPanelProps) {
  const clearHistory = useClearHistory();

  const handleExportCSV = () => {
    const csv = exportToCSV(samples);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `network-history-${timeWindow}-${timestamp}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const json = exportToJSON(samples);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(json, `network-history-${timeWindow}-${timestamp}.json`, 'application/json');
  };

  const handleClearHistory = () => {
    clearHistory.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Export or clear your network history
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button onClick={handleExportCSV} variant="outline">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button onClick={handleExportJSON} variant="outline">
          <FileJson className="w-4 h-4 mr-2" />
          Export JSON
        </Button>
        
        {isAuthenticated && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Network History?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all stored network measurements. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory}>
                  Clear History
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
