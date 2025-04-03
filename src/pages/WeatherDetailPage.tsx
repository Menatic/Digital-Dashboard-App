
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorDisplay from '@/components/UI/ErrorDisplay';
import WeatherChart from '@/components/Charts/WeatherChart';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchWeatherData, WeatherData } from '@/store/slices/weatherSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, Cloud, CloudRain, CloudLightning, CloudSun, Heart, Sun } from 'lucide-react';
import { toggleFavorite } from '@/store/slices/favoritesSlice';

const WeatherIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = "h-8 w-8" }) => {
  switch (icon) {
    case 'sun':
      return <Sun className={className} />;
    case 'cloud':
      return <Cloud className={className} />;
    case 'cloud-rain':
      return <CloudRain className={className} />;
    case 'cloud-lightning':
      return <CloudLightning className={className} />;
    case 'cloud-sun':
      return <CloudSun className={className} />;
    default:
      return <Sun className={className} />;
  }
};

const WeatherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { cities, loading, error } = useAppSelector(state => state.weather);
  const favorites = useAppSelector(state => state.favorites.items);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [historyData, setHistoryData] = useState<{ time: number; temperature: number; humidity: number }[]>([]);
  
  const isFavorite = favorites.some(item => item.id === id && item.type === 'weather');
  
  useEffect(() => {
    if (cities.length === 0 && !loading) {
      dispatch(fetchWeatherData());
    } else {
      const foundWeather = cities.find(city => city.id === id);
      if (foundWeather) {
        setWeather(foundWeather);
        
        // Generate mock historical data for the chart
        const now = new Date();
        const mockData = Array.from({ length: 24 }, (_, i) => {
          const time = new Date(now);
          time.setHours(now.getHours() - 23 + i);
          
          // Generate reasonable temperature fluctuation
          const hourOffset = (i - 12) * (i - 12) / 24; // Parabolic curve with max at noon
          const baseTemp = foundWeather.temperature - 5;
          const temperature = baseTemp + 10 * Math.sin((i / 24) * Math.PI * 2) - hourOffset;
          
          // Generate reasonable humidity fluctuation (inverse to temperature)
          const humidity = foundWeather.humidity - 10 * Math.sin((i / 24) * Math.PI * 2);
          
          return {
            time: time.getTime(),
            temperature: parseFloat(temperature.toFixed(1)),
            humidity: parseFloat(humidity.toFixed(1)),
          };
        });
        
        setHistoryData(mockData);
      }
    }
  }, [dispatch, cities, id, loading]);
  
  const handleToggleFavorite = () => {
    if (id) {
      dispatch(toggleFavorite({ id, type: 'weather' }));
    }
  };
  
  if (loading && !weather) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <ErrorDisplay message={error} onRetry={() => dispatch(fetchWeatherData())} />
      </MainLayout>
    );
  }
  
  if (!weather) {
    return (
      <MainLayout>
        <ErrorDisplay message="Weather data not found" />
        <div className="mt-4">
          <Link to="/weather" className="text-primary hover:underline">
            &larr; Back to Weather
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/weather" className="text-primary hover:underline inline-flex items-center">
          &larr; Back to Weather
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center">
            {weather.name}, {weather.country}
          </h1>
          <p className="text-lg text-muted-foreground">
            {new Date(weather.timestamp).toLocaleDateString()} {new Date(weather.timestamp).toLocaleTimeString()}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleToggleFavorite}
          className="mt-4 md:mt-0"
        >
          <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Weather Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <WeatherIcon icon={weather.icon} className="h-24 w-24 text-accent" />
            </div>
            
            <div className="text-center mb-6">
              <div className="text-5xl font-bold">{weather.temperature.toFixed(1)}°C</div>
              <div className="text-xl mt-2">{weather.conditions}</div>
              <div className="text-muted-foreground mt-1">Feels like {weather.feelsLike.toFixed(1)}°C</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Humidity</div>
                <div className="text-lg font-medium">{weather.humidity}%</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Wind Speed</div>
                <div className="text-lg font-medium">{weather.windSpeed} km/h</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Pressure</div>
                <div className="text-lg font-medium">{weather.pressure} hPa</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Visibility</div>
                <div className="text-lg font-medium">10 km</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Weather Chart */}
        <div className="lg:col-span-2">
          <WeatherChart
            title="24-Hour Temperature & Humidity"
            data={historyData}
          />
        </div>
      </div>
      
      {/* Forecast */}
      <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }, (_, index) => {
          const date = new Date();
          date.setDate(date.getDate() + index + 1);
          
          // Generate forecast data with some reasonable variance
          const tempVariance = Math.random() * 10 - 5;
          const forecastTemp = weather.temperature + tempVariance;
          
          // Cycle through conditions
          const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Thunderstorm'];
          const condition = conditions[(index + conditions.indexOf(weather.conditions)) % conditions.length];
          
          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <WeatherIcon 
                    icon={getWeatherIcon(condition)} 
                    className="h-8 w-8 mx-auto my-2 text-accent" 
                  />
                  <p className="text-lg font-bold">{forecastTemp.toFixed(1)}°C</p>
                  <p className="text-xs text-muted-foreground">{condition}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </MainLayout>
  );
};

// Helper function to get weather icon based on conditions
function getWeatherIcon(condition: string): string {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return 'sun';
    case 'cloudy':
      return 'cloud';
    case 'rainy':
      return 'cloud-rain';
    case 'partly cloudy':
      return 'cloud-sun';
    case 'thunderstorm':
      return 'cloud-lightning';
    default:
      return 'sun';
  }
}

export default WeatherDetailPage;
