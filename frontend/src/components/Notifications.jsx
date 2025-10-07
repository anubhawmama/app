import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import AppLayout from './AppLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Bell, 
  Check, 
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Trash2,
  MarkAsRead,
  Filter,
  Search,
  Settings,
  RefreshCw
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Planning Request Submitted',
      message: 'Your Q2 2025 planning request has been submitted successfully.',
      timestamp: '2025-03-15T14:30:00Z',
      read: false,
      priority: 'medium',
      category: 'planning',
      actionRequired: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Deadline Reminder',
      message: 'Planning submission deadline is approaching. Please submit your March planning by end of day.',
      timestamp: '2025-03-15T09:00:00Z',
      read: false,
      priority: 'high',
      category: 'deadline',
      actionRequired: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Permission Updated',
      message: 'Your permissions have been updated. You now have access to the Reports section.',
      timestamp: '2025-03-14T16:45:00Z',
      read: true,
      priority: 'low',
      category: 'system',
      actionRequired: false
    },
    {
      id: 4,
      type: 'error',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 11 PM to 2 AM. Plan accordingly.',
      timestamp: '2025-03-14T12:20:00Z',
      read: false,
      priority: 'high',
      category: 'system',
      actionRequired: false
    },
    {
      id: 5,
      type: 'info',
      title: 'New Feature Available',
      message: 'Financial Planning module is now available. Check it out in the Planning section.',
      timestamp: '2025-03-13T11:15:00Z',
      read: true,
      priority: 'medium',
      category: 'feature',
      actionRequired: false
    },
    {
      id: 6,
      type: 'warning',
      title: 'Data Sync Issue',
      message: 'Some planning data may not be up to date. Please refresh and try again.',
      timestamp: '2025-03-13T08:30:00Z',
      read: false,
      priority: 'medium',
      category: 'system',
      actionRequired: true
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted",
      description: "Notification has been deleted.",
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'read':
        return notif.read;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-slate-600" />
              <h1 className="text-xl font-semibold text-slate-900">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: notifications.filter(n => n.read).length }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? "default" : "ghost"}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 ${filter === tab.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {tab.label}
              <Badge 
                variant="secondary" 
                className={`ml-2 ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {tab.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications</h3>
                <p className="text-slate-600">
                  {filter === 'unread' ? "You're all caught up! No unread notifications." : 
                   filter === 'read' ? "No read notifications to display." : 
                   "You don't have any notifications yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`shadow-lg transition-all duration-200 hover:shadow-xl ${
                  !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-slate-900">
                            {notification.title}
                          </h3>
                          <Badge variant={getBadgeVariant(notification.type)}>
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-slate-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center text-sm text-slate-500">
                          <span>{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {notifications.length > 0 && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Notification Summary</CardTitle>
              <CardDescription>Overview of your notification activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{notifications.length}</div>
                  <div className="text-sm text-slate-600">Total</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">{unreadCount}</div>
                  <div className="text-sm text-blue-600">Unread</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">
                    {notifications.filter(n => n.type === 'success').length}
                  </div>
                  <div className="text-sm text-green-600">Success</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">
                    {notifications.filter(n => n.type === 'error').length}
                  </div>
                  <div className="text-sm text-red-600">Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;