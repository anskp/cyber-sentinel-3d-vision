
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard
    navigate('/dashboard');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark text-foreground">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-cyber-blue-light mb-2">Loading Security Dashboard...</h1>
        <p className="text-muted-foreground">Please wait while we initialize your security environment.</p>
      </div>
    </div>
  );
};

export default Index;
