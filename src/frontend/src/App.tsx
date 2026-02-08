import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from 'next-themes';
import DashboardView from './features/dashboard/DashboardView';
import DiagnosticsView from './features/diagnostics/DiagnosticsView';
import SettingsView from './features/settings/SettingsView';
import LoginButton from './features/auth/LoginButton';
import ProfileSetupModal from './features/profile/ProfileSetupModal';
import { useConnectivityMonitor } from './features/monitoring/useConnectivityMonitor';
import { Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentStatus, metrics, samples, isAuthenticated } = useConnectivityMonitor();

  const statusColors = {
    Stable: 'text-emerald-500',
    Degraded: 'text-amber-500',
    Offline: 'text-red-500',
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <ProfileSetupModal />
        
        {/* Header */}
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/generated/net-stabilizer-icon.dim_256x256.png" 
                  alt="Network Stabilizer"
                  className="w-10 h-10"
                />
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Network Stabilizer</h1>
                  <p className="text-xs text-muted-foreground">Real-time connectivity monitoring</p>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50">
                  <Activity className={`w-4 h-4 ${statusColors[currentStatus]}`} />
                  <span className="text-sm font-medium">{currentStatus}</span>
                </div>
                <LoginButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-0">
              <DashboardView 
                currentStatus={currentStatus}
                metrics={metrics}
                isAuthenticated={isAuthenticated}
              />
            </TabsContent>

            <TabsContent value="diagnostics" className="mt-0">
              <DiagnosticsView samples={samples} isAuthenticated={isAuthenticated} />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SettingsView />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-16 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026. Built with ❤️ using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
