
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

// API key would normally be stored in environment variables
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

// Fetch weather data for multiple cities
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      // For demo purposes, let's use mock data instead of actual API calls
      const mockWeatherData: WeatherData[] = predefinedCities.map((city, index) => {
        // Generate some random but reasonable weather data
        const temperature = Math.floor(Math.random() * 30) + 5; // 5 to 35°C
        const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Thunderstorm'][
          Math.floor(Math.random() * 5)
        ];
        const humidity = Math.floor(Math.random() * 60) + 30; // 30% to 90%
        const windSpeed = Math.floor(Math.random() * 20) + 5; // 5 to 25 km/h
        const pressure = Math.floor(Math.random() * 30) + 990; // 990 to 1020 hPa
        const feelsLike = temperature + (Math.random() > 0.5 ? 2 : -2); // Random offset from actual temp

        return {
          id: `${city.name.toLowerCase()}-${city.country.toLowerCase()}`,
          name: city.name,
          country: city.country,
          temperature,
          humidity,
          conditions,
          icon: getWeatherIcon(conditions),
          windSpeed,
          pressure,
          feelsLike,
          timestamp: Date.now(),
        };
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockWeatherData;
    } catch (error) {
      return rejectWithValue('Failed to fetch weather data');
    }
  }
);

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
