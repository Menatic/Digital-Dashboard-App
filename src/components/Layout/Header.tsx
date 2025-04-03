
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationsPanel from '../Notifications/NotificationsPanel';
import { useAppSelector } from '@/hooks/useAppSelector';

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-bold text-foreground flex items-center">
            <span className="text-accent">Crypto</span>
            <span className="text-foreground">Weather</span>
            <span className="text-primary">Nexus</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-accent transition-colors">
            Dashboard
          </Link>
          <Link to="/weather" className="text-foreground hover:text-accent transition-colors">
            Weather
          </Link>
          <Link to="/crypto" className="text-foreground hover:text-accent transition-colors">
            Crypto
          </Link>
          <Link to="/favorites" className="text-foreground hover:text-accent transition-colors">
            Favorites
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            {showNotifications && (
              <NotificationsPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border py-4">
          <nav className="flex flex-col space-y-4 px-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/weather" 
              className="text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Weather
            </Link>
            <Link 
              to="/crypto" 
              className="text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Crypto
            </Link>
            <Link 
              to="/favorites" 
              className="text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Favorites
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
