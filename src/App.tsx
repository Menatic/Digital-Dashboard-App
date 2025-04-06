
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Index from "./pages/Index";
import WeatherPage from "./pages/WeatherPage";
import CryptoPage from "./pages/CryptoPage";
import WeatherDetailPage from "./pages/WeatherDetailPage";
import CryptoDetailPage from "./pages/CryptoDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/weather/:id" element={<WeatherDetailPage />} />
              <Route path="/crypto" element={<CryptoPage />} />
              <Route path="/crypto/:id" element={<CryptoDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
