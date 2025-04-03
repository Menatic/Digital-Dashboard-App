
import React from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh, isLoading }) => {
  const weatherLastUpdated = useAppSelector(state => state.weather.lastUpdated);
  const cryptoLastUpdated = useAppSelector(state => state.crypto.lastUpdated);
  const newsLastUpdated = useAppSelector(state => state.news.lastUpdated);

  // Find the most recent update time
  const lastUpdated = Math.max(
    weatherLastUpdated || 0,
    cryptoLastUpdated || 0,
    newsLastUpdated || 0
  );

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {lastUpdated ? (
            <>Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}</>
          ) : (
            'Loading data...'
          )}
        </p>
      </div>
      <Button 
        onClick={onRefresh} 
        disabled={isLoading}
        className="mt-4 md:mt-0"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default DashboardHeader;
