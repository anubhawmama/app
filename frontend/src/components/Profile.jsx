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
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Key,
  Camera,
  Edit,
  Save,
  X,
  Check,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  Activity
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'System Admin',
    email: user?.email || 'admin@demo.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    department: 'Administration',
    title: 'System Administrator',
    bio: 'Experienced system administrator with expertise in planning systems and user management.',
    joinDate: '2023-01-15',
    avatar: user?.avatar || null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="flex items-center h-16 px-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold text-slate-900">Profile Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/api/placeholder/150/150" alt={profileData.name} />
                    <AvatarFallback className="text-2xl bg-slate-900 text-white">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl text-slate-900">{profileData.name}</CardTitle>
                <CardDescription className="text-slate-600">{profileData.email}</CardDescription>
                <div className="flex justify-center mt-3">
                  <Badge className="bg-slate-900 text-white">Administrator</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {profileData.location}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <User className="h-4 w-4 mr-2" />
                  {profileData.department}
                </div>
                <Separator />
                <div className="text-sm">
                  <p className="text-slate-500 mb-1">Member since</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(profileData.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900">Personal Information</CardTitle>
                  <CardDescription>Update your personal details and preferences</CardDescription>
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-slate-200 focus:border-slate-400"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-900">
                        {profileData.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="border-slate-200 focus:border-slate-400"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-slate-400" />
                        {profileData.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="border-slate-200 focus:border-slate-400"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        {profileData.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-700">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="border-slate-200 focus:border-slate-400"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-900 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                        {profileData.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-700">Bio</Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
                    />
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-900">
                      {profileData.bio}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Password</h4>
                    <p className="text-sm text-slate-600">Last updated 2 months ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;