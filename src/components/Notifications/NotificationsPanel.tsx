
import React from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { markAllAsRead, markAsRead, clearNotifications } from '@/store/slices/notificationsSlice';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector(state => state.notifications);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  return (
    <Card className="absolute top-10 right-0 w-80 md:w-96 shadow-lg z-50">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-1">
              {unreadCount} new
            </span>
          )}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto p-0">
        {notifications.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`p-4 flex gap-3 ${notification.read ? 'bg-transparent' : 'bg-secondary/30'}`}
              >
                <div 
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    notification.type === 'price_alert' ? 'bg-accent/20 text-accent' : 'bg-warning/20 text-warning'
                  }`}
                >
                  {notification.type === 'price_alert' ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 flex-shrink-0" 
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={unreadCount === 0}
          onClick={handleMarkAllAsRead}
        >
          Mark all read
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={notifications.length === 0}
          onClick={handleClearAll}
        >
          Clear all
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationsPanel;
