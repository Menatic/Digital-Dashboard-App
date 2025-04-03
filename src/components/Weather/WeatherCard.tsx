
import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, CloudRain, CloudLightning, CloudSun, Heart, Sun } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeatherData } from '@/store/slices/weatherSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleFavorite } from '@/store/slices/favoritesSlice';

interface WeatherCardProps {
  weather: WeatherData;
}

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

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const isFavorite = favorites.some(item => item.id === weather.id && item.type === 'weather');

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite({ id: weather.id, type: 'weather' }));
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            {weather.name}, {weather.country}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggleFavorite}
            className="h-8 w-8"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <WeatherIcon icon={weather.icon} className="h-10 w-10 mr-2 text-accent" />
            <div>
              <p className="text-2xl font-bold">{weather.temperature.toFixed(1)}°C</p>
              <p className="text-sm text-muted-foreground">{weather.conditions}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">Humidity: {weather.humidity}%</p>
            <p className="text-sm">Wind: {weather.windSpeed} km/h</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link 
          to={`/weather/${weather.id}`} 
          className="text-sm text-primary hover:underline w-full text-center"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default WeatherCard;
