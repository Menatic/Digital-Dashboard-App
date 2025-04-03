
import React, { useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import WeatherCard from '@/components/Weather/WeatherCard';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorDisplay from '@/components/UI/ErrorDisplay';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const WeatherPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cities, loading, error, lastUpdated } = useAppSelector(state => state.weather);
  
  useEffect(() => {
    if (cities.length === 0 && !loading) {
      dispatch(fetchWeatherData());
    }
  }, [dispatch, cities.length, loading]);
  
  const handleRefresh = () => {
    dispatch(fetchWeatherData());
  };
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Weather</h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </p>
          )}
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {loading && cities.length === 0 ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorDisplay message={error} onRetry={handleRefresh} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map(city => (
            <WeatherCard key={city.id} weather={city} />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default WeatherPage;
