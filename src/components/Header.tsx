
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Search, 
  Shield, 
  BarChart, 
  Settings, 
  Bell,
  User,
  LogOut
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  return (
    <header className="border-b border-cyber-blue border-opacity-20 bg-cyber-darker">
      <div className="container py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-cyber-blue" />
          <h1 className="text-xl font-bold text-cyber-blue">CyberSentinel</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="text-foreground hover:text-cyber-blue-light" asChild>
            <a href="/" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
          </Button>
          
          <Button variant="ghost" className="text-foreground hover:text-cyber-blue-light" asChild>
            <a href="/scans" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Scans</span>
            </a>
          </Button>
          
          <Button variant="ghost" className="text-foreground hover:text-cyber-blue-light" asChild>
            <a href="/reports" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Reports</span>
            </a>
          </Button>
          
          <Button variant="ghost" className="text-foreground hover:text-cyber-blue-light" asChild>
            <a href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </a>
          </Button>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-cyber-red"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full bg-cyber-blue h-8 w-8">
                <User className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-cyber-darker border-cyber-blue border-opacity-30">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2 text-cyber-red cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
