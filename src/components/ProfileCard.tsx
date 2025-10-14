
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Copy, Eye, EyeOff, Shield, Clock, User, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface UserChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: number;
  totalViews: number;
  totalVideos: number;
}

interface UserData {
  id: string;
  email: string;
  username: string;
  registrationDate: string;
  recoveryCode?: string;
  channel?: UserChannel;
}

interface ProfileCardProps {
  user: UserData;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [showRecoveryCode, setShowRecoveryCode] = useState(false);

  // Check if recovery code is available (within 7 days of registration)
  const registrationDate = new Date(user.registrationDate);
  const now = new Date();
  const daysSinceRegistration = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
  const isRecoveryCodeExpired = daysSinceRegistration > 7;
  const daysRemaining = Math.max(0, 7 - daysSinceRegistration);

  const copyRecoveryCode = () => {
    if (user.recoveryCode) {
      navigator.clipboard.writeText(user.recoveryCode);
      toast.success('Recovery code copied to clipboard');
    }
  };

  const formatRecoveryCode = (code: string) => {
    // Format as XXXX-XXXX-XXXX-XXXX
    return code.match(/.{1,4}/g)?.join('-') || code;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-br from-background via-card to-background border-2 border-border/50 shadow-2xl">
      {/* Header with gradient */}
      <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            <Shield className="h-3 w-3 mr-1" />
            {isRecoveryCodeExpired ? 'Secured' : 'Recovery Active'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 -mt-12 relative">
        {/* Profile Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-2 ring-primary/20">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}&backgroundColor=6366f1,8b5cf6,a855f7`}
                alt={user.username}
                className="object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
              <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-green-500 border-2 border-background rounded-full" />
          </div>
        </div>

        {/* User Info */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-foreground">{user.username}</h2>
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            <Mail className="h-4 w-4 mr-2" />
            {user.email}
          </div>
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            <User className="h-4 w-4 mr-2" />
            Member since {new Date(user.registrationDate).toLocaleDateString()}
          </div>
        </div>

        {/* Channel Info Section */}
        {user.channel && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                🎉 Creator
              </Badge>
              <h3 className="font-semibold text-lg">{user.channel.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.channel.handle}</p>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-bold">{user.channel.subscribers.toLocaleString()}</div>
                  <div className="text-muted-foreground">Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{user.channel.totalViews.toLocaleString()}</div>
                  <div className="text-muted-foreground">Views</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{user.channel.totalVideos}</div>
                  <div className="text-muted-foreground">Videos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recovery Code Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              Recovery Code
            </h3>
            {!isRecoveryCodeExpired && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {daysRemaining}d left
              </Badge>
            )}
          </div>

          {user.recoveryCode && !isRecoveryCodeExpired ? (
            <div className="bg-muted/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Keep this code safe - it expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecoveryCode(!showRecoveryCode)}
                  className="h-8 w-8 p-0"
                >
                  {showRecoveryCode ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="relative">
                <div className="bg-background border border-border rounded-md p-3 font-mono text-center">
                  {showRecoveryCode ? (
                    <span className="text-lg font-bold tracking-wider text-primary">
                      {formatRecoveryCode(user.recoveryCode)}
                    </span>
                  ) : (
                    <span className="text-lg tracking-wider text-muted-foreground">
                      ••••-••••-••••-••••
                    </span>
                  )}
                </div>
                
                {showRecoveryCode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyRecoveryCode}
                    className="absolute -right-2 -top-2 h-8 w-8 p-0 bg-background border-primary/50 hover:bg-primary hover:text-primary-foreground"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="mt-3 p-3 bg-accent/10 rounded-md border border-accent/20">
                <p className="text-xs text-muted-foreground text-center">
                  ⚠️ This code will be automatically removed after 7 days for security
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-4 border border-muted">
              <div className="text-center space-y-2">
                <Shield className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isRecoveryCodeExpired 
                    ? 'Recovery code has been automatically removed for security'
                    : 'No recovery code available'
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  Your account is now secured through standard recovery methods
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-primary/5 rounded-lg">
            <div className="text-lg font-bold text-primary">
              {daysSinceRegistration}
            </div>
            <div className="text-xs text-muted-foreground">Days Active</div>
          </div>
          <div className="p-3 bg-accent/5 rounded-lg">
            <div className="text-lg font-bold text-accent">
              {user.recoveryCode && !isRecoveryCodeExpired ? 'Secured' : 'Protected'}
            </div>
            <div className="text-xs text-muted-foreground">Status</div>
          </div>
          <div className="p-3 bg-green-500/5 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              Active
            </div>
            <div className="text-xs text-muted-foreground">Account</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

