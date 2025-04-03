
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FavoriteItem {
  id: string;
  type: 'weather' | 'crypto';
}

interface FavoritesState {
  items: FavoriteItem[];
}

// Try to load favorites from localStorage
const loadFavoritesFromStorage = (): FavoriteItem[] => {
  try {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Failed to load favorites from storage:', error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites: FavoriteItem[]) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to storage:', error);
  }
};

const initialState: FavoritesState = {
  items: loadFavoritesFromStorage(),
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const index = state.items.findIndex(
        item => item.id === action.payload.id && item.type === action.payload.type
      );
      
      if (index === -1) {
        // Add to favorites
        state.items.push(action.payload);
      } else {
        // Remove from favorites
        state.items.splice(index, 1);
      }
      
      // Save to localStorage
      saveFavoritesToStorage(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      saveFavoritesToStorage(state.items);
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
