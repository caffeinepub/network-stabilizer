import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DerivedMetrics, StabilityStatus } from '../monitoring/types';
import { Activity, Clock, TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface DashboardViewProps {
  currentStatus: StabilityStatus;
  metrics: DerivedMetrics;
  isAuthenticated: boolean;
}

export default function DashboardView({ currentStatus, metrics, isAuthenticated }: DashboardViewProps) {
  const statusConfig = {
    Stable: {
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    Degraded: {
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    Offline: {
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
  };

  const config = statusConfig[currentStatus];
  const StatusIcon = config.icon;

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Auth Status Alert */}
      {!isAuthenticated && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Sign in to persist your network history and access advanced features. Local monitoring is active.
          </AlertDescription>
        </Alert>
      )}

      {/* Primary Status Card */}
      <Card className={`${config.border} border-2`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Network Status</CardTitle>
              <CardDescription>Current connectivity state</CardDescription>
            </div>
            <div className={`${config.bg} p-4 rounded-full`}>
              <StatusIcon className={`w-8 h-8 ${config.color}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-4xl font-bold ${config.color}`}>
            {currentStatus}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Avg Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.avgLatency !== null ? `${metrics.avgLatency}ms` : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              Jitter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.jitter !== null ? `${metrics.jitter}ms` : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.successRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              Recent Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.recentErrorCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Success */}
      <Card>
        <CardHeader>
          <CardTitle>Last Successful Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg">
            {formatTimestamp(metrics.lastSuccessTimestamp)}
          </div>
        </CardContent>
      </Card>

      {/* Empty State Illustration */}
      {metrics.successRate === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <img 
            src="/assets/generated/net-stabilizer-hero.dim_1400x800.png"
            alt="Network Monitoring"
            className="max-w-md w-full opacity-50"
          />
          <p className="text-muted-foreground mt-4">
            Waiting for connectivity data...
          </p>
        </div>
      )}
    </div>
  );
}
