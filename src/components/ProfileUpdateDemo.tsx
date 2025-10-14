import { useState } from 'react';
import { ProfileEdit } from './ProfileEdit';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Settings } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
}

export function ProfileUpdateDemo() {
  const [showEdit, setShowEdit] = useState(false);
  const [user, setUser] = useState<UserData>({
    id: '1',
    email: 'hitesh@example.com',
    username: 'hiteshStreams',
    displayName: 'Hitesh Kumar',
    bio: 'Content creator and tech enthusiast sharing gaming and coding content 🎮💻',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/hiteshstreams', icon: 'Instagram' },
      { platform: 'Twitter', url: 'https://twitter.com/hiteshstreams', icon: 'Twitter' }
    ]
  });

  const handleSave = (updatedUser: Partial<UserData>) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
    setShowEdit(false);
    // In a real app, you would save to your backend here
    console.log('Profile updated:', updatedUser);
  };

  const handleCancel = () => {
    setShowEdit(false);
  };

  if (showEdit) {
    return (
      <ProfileEdit
        user={user}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Management</h1>
          <p className="text-muted-foreground">
            Comprehensive profile update with all your streaming essentials
          </p>
        </div>
        <Button 
          onClick={() => setShowEdit(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Settings className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">✨ Personal Information</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span><strong>Display Name</strong> – The name shown publicly on your channel</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span><strong>Username/Handle</strong> – Unique identifier (e.g., @hiteshStreams)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span><strong>Profile Picture</strong> – Upload or change avatar</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span><strong>Bio/Tagline</strong> – Short description or vibe statement</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">🌐 Social Presence</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span><strong>Social Links</strong> – Add or update links to Instagram, Twitter, Discord, etc.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span><strong>Contact Email</strong> – For business inquiries or collabs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span><strong>Multiple Platforms</strong> – Support for Instagram, Twitter, Discord, YouTube, TikTok, Twitch</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span><strong>Live Preview</strong> – See how your profile will look before saving</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Current Profile Preview:</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.displayName?.charAt(0) || user.username.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{user.displayName || user.username}</p>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                {user.bio && <p className="text-xs text-muted-foreground mt-1">{user.bio}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🚀 Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Click the "Edit Profile" button above to start customizing your streaming profile with all the features you requested.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowEdit(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Start Editing Profile
            </Button>
            <Button variant="outline">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}