
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface WeatherData {
  id: string;
  name: string;
  country: string;
  temperature: number;
  humidity: number;
  conditions: string;
  icon: string;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  timestamp: number;
}

interface WeatherState {
  cities: WeatherData[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: WeatherState = {
  cities: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Predefined cities to fetch weather data for
const predefinedCities = [
  { name: 'New York', country: 'US' },
  { name: 'London', country: 'GB' },
  { name: 'Tokyo', country: 'JP' },
  { name: 'Sydney', country: 'AU' },
  { name: 'Paris', country: 'FR' },
];

// API key should be stored in environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

// Fallback mock data in case API fails
const mockWeatherData: WeatherData[] = [
  {
    id: 'new-york-us',
    name: 'New York',
    country: 'US',
    temperature: 22.5,
    humidity: 65,
    conditions: 'Clear',
    icon: 'sun',
    windSpeed: 5.2,
    pressure: 1012,
    feelsLike: 23.1,
    timestamp: Date.now(),
  },
  // Add more mock data for other cities
  // ...
];

// Fetch weather data for multiple cities
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      // Check if we're in development mode and API key is missing
      if (import.meta.env.DEV && (!API_KEY || API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY')) {
        console.warn('Using mock weather data. Please provide a valid API key for production.');
        return mockWeatherData;
      }
      
      // Make actual API calls to OpenWeatherMap
      const weatherPromises = predefinedCities.map(async (city) => {
        // Check if API key is available
        if (!API_KEY || API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
          throw new Error('Valid OpenWeatherMap API key is required');
        }
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Error fetching weather for ${city.name}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return {
          id: `${city.name.toLowerCase()}-${city.country.toLowerCase()}`,
          name: data.name,
          country: city.country,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          conditions: data.weather[0].main,
          icon: getWeatherIcon(data.weather[0].main),
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
          feelsLike: data.main.feels_like,
          timestamp: Date.now(),
        };
      });
      
      // Wait for all API calls to complete
      const weatherData = await Promise.all(weatherPromises);
      return weatherData;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch weather data');
    }
  }
);

// Helper function to get weather icon based on conditions
function getWeatherIcon(condition: string): string {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'sun';
    case 'clouds':
      return 'cloud';
    case 'rain':
      return 'cloud-rain';
    case 'drizzle':
      return 'cloud-drizzle';
    case 'thunderstorm':
      return 'cloud-lightning';
    case 'snow':
      return 'cloud-snow';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'cloud-fog';
    default:
      return 'sun';
  }
}

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action: PayloadAction<WeatherData[]>) => {
        state.loading = false;
        state.cities = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default weatherSlice.reducer;
