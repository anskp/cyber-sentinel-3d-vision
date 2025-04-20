
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Server,
  Clock
} from "lucide-react";

interface Vulnerability {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'mitigated';
}

interface SecurityMetricsProps {
  threatLevel: 'low' | 'medium' | 'high' | 'none';
  scanProgress: number;
  vulnerabilities: Vulnerability[];
  lastScanTime?: string;
  systemsScanned?: number;
}

const SecurityMetrics = ({
  threatLevel = 'none',
  scanProgress = 0,
  vulnerabilities = [],
  lastScanTime = 'Never',
  systemsScanned = 0
}: SecurityMetricsProps) => {
  // Count vulnerabilities by severity
  const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
  const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;
  const lowCount = vulnerabilities.filter(v => v.severity === 'low').length;
  
  // Calculate security score (simple algorithm)
  const calculateSecurityScore = () => {
    if (vulnerabilities.length === 0) return 100;
    
    const weights = {
      critical: 10,
      high: 5,
      medium: 2,
      low: 1
    };
    
    const totalIssues = criticalCount * weights.critical + 
                        highCount * weights.high +
                        mediumCount * weights.medium +
                        lowCount * weights.low;
    
    // Max deduction is 100 points
    const score = Math.max(0, 100 - totalIssues);
    return score;
  };
  
  const securityScore = calculateSecurityScore();
  
  // Determine color based on security score
  const getScoreColor = () => {
    if (securityScore >= 80) return 'text-cyber-green';
    if (securityScore >= 50) return 'text-cyber-orange';
    return 'text-cyber-red';
  };
  
  // Get threat level icon
  const getThreatIcon = () => {
    switch (threatLevel) {
      case 'high':
        return <ShieldAlert className="h-8 w-8 text-cyber-red" />;
      case 'medium':
        return <AlertTriangle className="h-8 w-8 text-cyber-orange" />;
      case 'low':
        return <ShieldCheck className="h-8 w-8 text-cyber-green" />;
      default:
        return <ShieldCheck className="h-8 w-8 text-cyber-blue" />;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-cyber-darker border-cyber-blue border-opacity-20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {getThreatIcon()}
            <span>Threat Level: {threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)}</span>
          </CardTitle>
          <CardDescription>Current security status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Security Score</span>
                <span className={`text-sm font-medium ${getScoreColor()}`}>{securityScore}%</span>
              </div>
              <Progress 
                value={securityScore} 
                className="h-2 bg-cyber-dark"
                indicatorClassName={
                  securityScore >= 80 ? "bg-cyber-green" : 
                  securityScore >= 50 ? "bg-cyber-orange" : 
                  "bg-cyber-red"
                }
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-cyber-dark p-3 rounded-md flex flex-col">
                <span className="text-xs text-muted-foreground">Critical</span>
                <span className="text-lg font-semibold text-cyber-red">{criticalCount}</span>
              </div>
              <div className="bg-cyber-dark p-3 rounded-md flex flex-col">
                <span className="text-xs text-muted-foreground">High</span>
                <span className="text-lg font-semibold text-cyber-red">{highCount}</span>
              </div>
              <div className="bg-cyber-dark p-3 rounded-md flex flex-col">
                <span className="text-xs text-muted-foreground">Medium</span>
                <span className="text-lg font-semibold text-cyber-orange">{mediumCount}</span>
              </div>
              <div className="bg-cyber-dark p-3 rounded-md flex flex-col">
                <span className="text-xs text-muted-foreground">Low</span>
                <span className="text-lg font-semibold text-cyber-green">{lowCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-cyber-darker border-cyber-blue border-opacity-20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyber-blue" />
            <span>Scan Activity</span>
          </CardTitle>
          <CardDescription>Current and recent scan information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Scan Progress</span>
                <span className="text-sm font-medium">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2 bg-cyber-dark" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-cyber-dark p-3 rounded-md flex items-center space-x-3">
                <Clock className="h-5 w-5 text-cyber-blue-light" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Last Scan</span>
                  <span className="text-sm">{lastScanTime}</span>
                </div>
              </div>
              
              <div className="bg-cyber-dark p-3 rounded-md flex items-center space-x-3">
                <Server className="h-5 w-5 text-cyber-blue-light" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Systems Scanned</span>
                  <span className="text-sm">{systemsScanned}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMetrics;
