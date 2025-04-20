
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import NetworkVisualization from '@/components/NetworkVisualization';
import ScanConfigPanel from '@/components/ScanConfigPanel';
import SecurityMetrics from '@/components/SecurityMetrics';
import VulnerabilityTable from '@/components/VulnerabilityTable';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, Info } from 'lucide-react';

// Mock data
const MOCK_VULNERABILITIES = [
  {
    id: '1',
    name: 'CVE-2023-1234: OpenSSL Vulnerability',
    severity: 'critical',
    status: 'open',
    description: 'Critical vulnerability in OpenSSL that can lead to remote code execution.',
    detectedOn: '2025-04-15',
  },
  {
    id: '2',
    name: 'CVE-2023-5678: SQL Injection',
    severity: 'high',
    status: 'open',
    description: 'SQL injection vulnerability in login form.',
    detectedOn: '2025-04-16',
  },
  {
    id: '3',
    name: 'Outdated Apache Server',
    severity: 'medium',
    status: 'open',
    description: 'Apache server is running an outdated version with known vulnerabilities.',
    detectedOn: '2025-04-17',
  },
  {
    id: '4',
    name: 'Weak SSH Configuration',
    severity: 'medium',
    status: 'mitigated',
    description: 'SSH server allows weak ciphers and authentication methods.',
    detectedOn: '2025-04-10',
  },
  {
    id: '5',
    name: 'Missing HTTP Security Headers',
    severity: 'low',
    status: 'open',
    description: 'Web server is missing recommended security headers.',
    detectedOn: '2025-04-17',
  },
] as const;

const Dashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'none'>('none');
  const [vulnerabilities, setVulnerabilities] = useState<typeof MOCK_VULNERABILITIES>([]);
  const [lastScanTime, setLastScanTime] = useState<string>('Never');
  const [systemsScanned, setSystemsScanned] = useState(0);
  
  // Start a simulated scan
  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setThreatLevel('none');
    
    toast({
      title: "Scan started",
      description: "Initializing security scan...",
      duration: 3000,
    });
    
    // Reset vulnerabilities at start of scan
    setVulnerabilities([]);
  };
  
  // Stop the scan
  const handleStopScan = () => {
    setIsScanning(false);
    toast({
      title: "Scan stopped",
      description: "The scan was stopped before completion.",
      duration: 3000,
    });
  };
  
  // Simulate scan progress
  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        // Increment progress
        const newProgress = Math.min(prev + Math.random() * 5, 100);
        
        // If progress reaches certain thresholds, update threat level and findings
        if (prev < 20 && newProgress >= 20) {
          // First discovery
          setThreatLevel('low');
          setVulnerabilities([MOCK_VULNERABILITIES[4]]);
          
          toast({
            title: "Low severity issue found",
            description: "Missing HTTP Security Headers detected",
            duration: 5000,
          });
        }
        
        if (prev < 40 && newProgress >= 40) {
          // More findings
          setThreatLevel('medium');
          setVulnerabilities(prev => [...prev, MOCK_VULNERABILITIES[2], MOCK_VULNERABILITIES[3]]);
          
          toast({
            title: "Medium severity issues found",
            description: "Outdated Apache Server detected",
            duration: 5000,
          });
        }
        
        if (prev < 70 && newProgress >= 70) {
          // Critical findings
          setThreatLevel('high');
          setVulnerabilities(prev => [...prev, MOCK_VULNERABILITIES[1]]);
          
          toast({
            icon: <AlertTriangle className="h-4 w-4 text-cyber-red" />,
            title: "High severity issue found!",
            description: "SQL Injection vulnerability detected",
            duration: 6000,
            variant: "destructive",
          });
        }
        
        if (prev < 90 && newProgress >= 90) {
          // Final critical finding
          setVulnerabilities(prev => [...prev, MOCK_VULNERABILITIES[0]]);
          
          toast({
            icon: <AlertTriangle className="h-4 w-4 text-cyber-red" />,
            title: "CRITICAL vulnerability found!",
            description: "OpenSSL Vulnerability detected - Immediate action required",
            duration: 8000,
            variant: "destructive",
          });
        }
        
        // Complete the scan
        if (newProgress >= 100) {
          setIsScanning(false);
          setLastScanTime(new Date().toLocaleString());
          setSystemsScanned(prev => prev + 1);
          
          toast({
            icon: <Info className="h-4 w-4 text-cyber-blue" />,
            title: "Scan completed",
            description: `Found ${vulnerabilities.length} vulnerabilities. Generating report...`,
            duration: 5000,
          });
        }
        
        return newProgress;
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, [isScanning, vulnerabilities.length]);
  
  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-foreground">
      <Header />
      
      <main className="flex-1 container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl font-bold">Security Dashboard</h1>
            
            <div className="bg-cyber-darker rounded-lg border border-cyber-blue border-opacity-20 overflow-hidden h-[400px]">
              <NetworkVisualization 
                scanActive={isScanning}
                threatLevel={threatLevel}
              />
            </div>
            
            <SecurityMetrics 
              threatLevel={threatLevel}
              scanProgress={scanProgress}
              vulnerabilities={vulnerabilities}
              lastScanTime={lastScanTime}
              systemsScanned={systemsScanned}
            />
            
            <VulnerabilityTable vulnerabilities={vulnerabilities} />
          </div>
          
          <div className="space-y-6">
            <ScanConfigPanel 
              onStartScan={handleStartScan}
              onStopScan={handleStopScan}
              isScanning={isScanning}
            />
            
            <div className="bg-cyber-darker p-4 rounded-lg border border-cyber-blue border-opacity-20">
              <h2 className="text-lg font-semibold mb-3 text-cyber-blue-light">Activity Feed</h2>
              
              <div className="space-y-3">
                {isScanning ? (
                  <div className="bg-cyber-dark p-3 rounded border-l-4 border-cyber-blue">
                    <p className="text-sm">
                      <span className="font-semibold">Active Scan:</span>{' '}
                      Scanning network for vulnerabilities...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Just now</p>
                  </div>
                ) : null}
                
                {vulnerabilities.map((vuln, index) => (
                  <div 
                    key={vuln.id} 
                    className={`bg-cyber-dark p-3 rounded border-l-4 ${
                      vuln.severity === 'critical' || vuln.severity === 'high' 
                        ? 'border-cyber-red' 
                        : vuln.severity === 'medium' 
                          ? 'border-cyber-orange' 
                          : 'border-cyber-green'
                    }`}
                  >
                    <p className="text-sm">
                      <span className="font-semibold">
                        {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)} Issue:
                      </span>{' '}
                      {vuln.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {index === 0 ? '2 minutes ago' : 
                       index === 1 ? '5 minutes ago' : 
                       index === 2 ? '12 minutes ago' : 
                       index === 3 ? '15 minutes ago' : '20 minutes ago'}
                    </p>
                  </div>
                ))}
                
                {!isScanning && vulnerabilities.length === 0 && (
                  <div className="bg-cyber-dark p-3 rounded text-center text-muted-foreground">
                    <p>No recent activity</p>
                    <p className="text-xs mt-1">Start a scan to monitor for threats</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
