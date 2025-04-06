
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  imageUrl?: string;
  publishedAt: string;
}

interface NewsState {
  articles: NewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: NewsState = {
  articles: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// API key should be stored in environment variables
const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;

// Fetch news data from NewsData.io
export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async (_, { rejectWithValue }) => {
    try {
      // Check if API key is available
      if (!API_KEY || API_KEY === 'YOUR_NEWSDATA_API_KEY') {
        throw new Error('Valid NewsData.io API key is required');
      }
      
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency,bitcoin,blockchain&language=en&category=business,technology`
      );
      
      if (!response.ok) {
        throw new Error(`Error fetching news: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid news data format');
      }
      
      const newsItems: NewsItem[] = data.results.map((article: any, index: number) => ({
        id: article.article_id || `news-${index}-${Date.now()}`,
        title: article.title,
        description: article.description || 'No description available',
        url: article.link,
        source: article.source_id,
        imageUrl: article.image_url,
        publishedAt: article.pubDate,
      }));
      
      return newsItems;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch news data');
    }
  }
);

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsData.fulfilled, (state, action: PayloadAction<NewsItem[]>) => {
        state.loading = false;
        state.articles = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default newsSlice.reducer;
