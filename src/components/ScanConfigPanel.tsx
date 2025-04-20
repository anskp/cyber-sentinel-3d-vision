
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  PauseCircle, 
  Clock, 
  AlertTriangle, 
  Shield, 
  Database, 
  Server
} from 'lucide-react';

interface ScanConfigPanelProps {
  onStartScan: () => void;
  onStopScan: () => void;
  isScanning: boolean;
}

const ScanConfigPanel = ({ 
  onStartScan, 
  onStopScan, 
  isScanning 
}: ScanConfigPanelProps) => {
  const [scanTarget, setScanTarget] = useState('');
  const [scanType, setScanType] = useState('vulnerability');
  const [options, setOptions] = useState({
    deepScan: false,
    portScan: true,
    osDetection: false,
    scheduleScan: false,
  });

  const handleToggleOption = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleStartScan = () => {
    if (!scanTarget) return;
    onStartScan();
  };

  return (
    <div className="bg-cyber-darker p-5 rounded-lg border border-cyber-blue border-opacity-20 glow">
      <h2 className="text-xl font-semibold mb-4 text-cyber-blue-light">Scan Configuration</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target" className="text-sm text-cyber-blue-light">Target</Label>
          <Input
            id="target"
            placeholder="IP address or hostname"
            value={scanTarget}
            onChange={(e) => setScanTarget(e.target.value)}
            className="bg-cyber-dark border-cyber-blue border-opacity-30 text-foreground"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scan-type" className="text-sm text-cyber-blue-light">Scan Type</Label>
          <Select value={scanType} onValueChange={setScanType}>
            <SelectTrigger id="scan-type" className="bg-cyber-dark border-cyber-blue border-opacity-30">
              <SelectValue placeholder="Select scan type" />
            </SelectTrigger>
            <SelectContent className="bg-cyber-darker border-cyber-blue border-opacity-30">
              <SelectItem value="vulnerability">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-cyber-red" />
                  <span>Vulnerability Scan</span>
                </div>
              </SelectItem>
              <SelectItem value="network">
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-cyber-blue" />
                  <span>Network Discovery</span>
                </div>
              </SelectItem>
              <SelectItem value="web">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-cyber-green" />
                  <span>Web Application Scan</span>
                </div>
              </SelectItem>
              <SelectItem value="database">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-cyber-purple" />
                  <span>Database Assessment</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                id="deep-scan" 
                checked={options.deepScan}
                onCheckedChange={() => handleToggleOption('deepScan')}
              />
              <Label htmlFor="deep-scan" className="text-sm">Deep Scan</Label>
            </div>
            <span className="text-xs text-muted-foreground">+15m</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                id="port-scan" 
                checked={options.portScan}
                onCheckedChange={() => handleToggleOption('portScan')}
              />
              <Label htmlFor="port-scan" className="text-sm">Port Scan</Label>
            </div>
            <span className="text-xs text-muted-foreground">+5m</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                id="os-detection" 
                checked={options.osDetection}
                onCheckedChange={() => handleToggleOption('osDetection')}
              />
              <Label htmlFor="os-detection" className="text-sm">OS Detection</Label>
            </div>
            <span className="text-xs text-muted-foreground">+8m</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                id="schedule-scan" 
                checked={options.scheduleScan}
                onCheckedChange={() => handleToggleOption('scheduleScan')}
              />
              <Label htmlFor="schedule-scan" className="text-sm">Schedule Scan</Label>
            </div>
            <Clock size={16} className="text-muted-foreground" />
          </div>
        </div>
        
        <div className="pt-3">
          {!isScanning ? (
            <Button 
              className="w-full bg-cyber-blue hover:bg-cyber-blue/90 text-white"
              onClick={handleStartScan}
              disabled={!scanTarget}
            >
              <Play size={16} className="mr-2" />
              Start Scan
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={onStopScan}
            >
              <PauseCircle size={16} className="mr-2" />
              Stop Scan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanConfigPanel;
